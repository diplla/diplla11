# -*- coding: utf-8 -*-
##############################################################################
#
#    Diplla Private Ltd, Grow your Business
#    Copyright (C) 2020 Diplla Private Ltd. (<https://www.diplla.com>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

import logging
import odoo
import base64
import psycopg2

from odoo import models, fields, api, exceptions, _
from odoo import tools, api
from odoo.addons.base.ir.ir_mail_server import MailDeliveryException
from odoo.tools.safe_eval import safe_eval
from odoo.exceptions import ValidationError
import math
from tempfile import TemporaryFile, NamedTemporaryFile
from odoo.exceptions import UserError
import os.path
import csv
from datetime import datetime
from datetime import timedelta
from email.utils import formataddr


class IrAttachment(models.Model):
    _inherit = 'ir.attachment'

    @api.model
    def get_file_size(self, attachments,remove_id):
        if remove_id in attachments:
            attachments.remove(remove_id)
        attachment_ids = self.sudo().browse(attachments)
        filesize = 0
        for attach in attachment_ids:
            filesize = filesize + attach.file_size
        if filesize == 0:
            return "0 B"
        size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
        i = int(math.floor(math.log(filesize, 1000)))
        p = math.pow(1000, i)
        s = round(filesize / p, 2)
        return "%s  %s" % (s, size_name[i])

