from odoo import fields, models, api,_

class ResUsers(models.Model):
    _inherit = 'res.users'

    phone_number = fields.Char(string='Phone Number')

     

