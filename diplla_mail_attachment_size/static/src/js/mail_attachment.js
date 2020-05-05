odoo.define('diplla_mail_attachment_size.mail_attachment_inherit', function (require) {
'use strict';

    var core = require('web.core');
    var Pager = require('web.Pager');
    var datepicker = require('web.datepicker');
    var Dialog = require('web.Dialog');
    //var field_attachment = require('web.many2many_binary');
    var relational_fields = require('web.relational_fields');
    var ListRenderer = require('web.ListRenderer');
    var _t = core._t;

    var qweb = core.qweb;

    relational_fields.FieldMany2ManyBinaryMultiFiles.include({
        events: {
            'click .o_attach': '_onAttach',
            'click .oe_delete': '_onDelete',
            'change .o_input_file': '_onFileChanged',
        },
        fieldsToFetch: {
            name: {type: 'char'},
            datas_fname: {type: 'char'},
            mimetype: {type: 'char'},
            file_size: {type: 'int'},
        },
        reload_size: function (remove_id) {
            var remove = remove_id
            var attachment_ids = this.value.res_ids;
            this._rpc({
                model: 'ir.attachment',
                method: 'get_file_size',
                args: [attachment_ids,remove],
            })
            .then(function (result) { // send the email server side
                $( "#attachment_size" ).html(result)
            });
        },
        _onDelete: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var fileID = $(ev.currentTarget).data('id');
            var record = _.findWhere(this.value.data, {res_id: fileID});
            if (record) {
                this._setValue({
                    operation: 'FORGET',
                    ids: [record.id],
                });
                var metadata = this.metadata[record.id];
                if (!metadata || metadata.allowUnlink) {
                    this._rpc({
                        model: 'ir.attachment',
                        method: 'unlink',
                        args: [record.res_id],
                    });
                }
            }
            this.reload_size(record.res_id)
        },
        _onFileLoaded: function () {
            var self = this;
            // the first argument isn't a file but the jQuery.Event
            var files = Array.prototype.slice.call(arguments, 1);
            // files has been uploaded, clear uploading
            this.uploadingFiles = [];

            var attachment_ids = this.value.res_ids;
            _.each(files, function (file) {
                if (file.error) {
                    self.do_warn(_t('Uploading Error'), file.error);
                } else {
                    attachment_ids.push(file.id);
                    self.uploadedFiles[file.id] = true;
                }
            });

            this._setValue({
                operation: 'REPLACE_WITH',
                ids: attachment_ids,
            });
            this.reload_size(0)
        }
    });

    ListRenderer.include({
        setRowMode: function (recordID, mode) {
            var self = this;

            // find the record and its row index (handles ungrouped and grouped cases
            // as even if the grouped list doesn't support edition, it may contain
            // a widget allowing the edition in readonly (e.g. priority), so it
            // should be able to update a record as well)
            var record;
            var rowIndex;
            if (this.state.groupedBy.length) {
                rowIndex = -1;
                var count = 0;
                utils.traverse_records(this.state, function (r) {
                    if (r.id === recordID) {
                        record = r;
                        rowIndex = count;
                    }
                    count++;
                });
            } else {
                rowIndex = _.findIndex(this.state.data, {id: recordID});
                record = this.state.data[rowIndex];
            }

            if (rowIndex < 0) {
                return $.when();
            }
            var editMode = (mode === 'edit');

            this.currentRow = editMode ? rowIndex : null;
            var $row = this.$('.o_data_row:nth(' + rowIndex + ')');
            var $tds = $row.children('.o_data_cell');
            var oldWidgets = _.clone(this.allFieldWidgets[record.id]);

            // When switching to edit mode, force the dimensions of all cells to
            // their current value so that they won't change if their content
            // changes, to prevent the view from flickering.
            if (editMode) {
                $tds.each(function () {
                    var $td = $(this);
                    $td.css({width: $td.outerWidth()});
                });
            }

            // Prepare options for cell rendering (this depends on the mode)
            var options = {
                renderInvisible: editMode,
                renderWidgets: editMode,
            };
            options.mode = editMode ? 'edit' : 'readonly';

            // Switch each cell to the new mode; note: the '_renderBodyCell'
            // function might fill the 'this.defs' variables with multiple deferred
            // so we create the array and delete it after the rendering.
            var defs = [];
            this.defs = defs;
            _.each(this.columns, function (node, colIndex) {
                var $td = $tds.eq(colIndex);
                var $newTd = self._renderBodyCell(record, node, colIndex, options);

                // Widgets are unregistered of modifiers data when they are
                // destroyed. This is not the case for simple buttons so we have to
                // do it here.
                if ($td.hasClass('o_list_button')) {
                    self._unregisterModifiersElement(node, recordID, $td.children());
                }

                // For edit mode we only replace the content of the cell with its
                // new content (invisible fields, editable fields, ...).
                // For readonly mode, we replace the whole cell so that the
                // dimensions of the cell are not forced anymore.
                if (editMode) {
                    $td.empty().append($newTd.contents());
                } else {
                    self._unregisterModifiersElement(node, recordID, $td);
                    $td.replaceWith($newTd);
                }
            });
            delete this.defs;

            // Destroy old field widgets
            _.each(oldWidgets, this._destroyFieldWidget.bind(this, recordID));

            // Toggle selected class here so that style is applied at the end
            // $row.toggleClass('o_selected_row', editMode); // Commented due to OD-671
            return $.when.apply($, defs);
        },
    });

});
