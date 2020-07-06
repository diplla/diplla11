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

{
    'name': 'Email Attachments Size',
    'version': '0.1',
    'application': False,
    'author': 'Diplla Private Ltd',
    'website': 'https://www.diplla.com',
    #~ 'license': 'LGPL-3',
    'category': 'Email',
    'summary': 'Email Attachments size',
    'description': """
        Display size of total attachments of an email
    """,
    'depends': ['base'],
    'data': [
        'views/diplla_assets.xml',
    ],
    'installable': True,
    'qweb': ['static/src/xml/mail_attachment.xml', ],
    "images": ['static/description/icon.png'],
}
