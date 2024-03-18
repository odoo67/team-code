import logging
from odoo.http import request
from odoo.addons.auth_signup.controllers.main import AuthSignupHome as Home
from odoo import http



class OAuthLogin(Home):

    @http.route(['/web/signup'], type='http', auth="public", website=True)
    def web_auth_signup(self, *args, **kw):
        result = super(OAuthLogin, self).web_auth_signup(*args, **kw)
        if kw.get('login'):
            user = request.env['res.users'].sudo().search([('login', '=', kw.get('login'))])
            print(user,kw)
            # if kw.get('phone_number') and user:
            #     user.phone_number = kw.get('phone_number')
            if kw.get('phone_number') and user:
                user.partner_id.phone = kw.get('phone_number') #Remove commas from the input
                user.partner_id.mobile = kw.get('phone_number') #Remove commas from the input
                
    
        return result


