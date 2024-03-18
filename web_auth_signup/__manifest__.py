{
    'name': 'web auth signup',
    'summary': 'Inherit auth_signup and add phone number field',
    'depends': ['base','auth_signup'],
    'data': [
        'views/res_users.xml',
    ],
    'installable': True,
}
