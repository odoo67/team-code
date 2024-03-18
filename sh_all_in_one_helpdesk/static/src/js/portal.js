odoo.define('sh_all_in_one_helpdesk.CreateTicketPopup', function (require) {
    'use strict';


    var publicWidget = require('web.public.widget');
    var ajax = require('web.ajax');

    publicWidget.registry.CreateTicketPopup = publicWidget.Widget.extend({
        selector: '#createticketModal',


        events: {
            'change #portal_file': '_onChangePortalFile',
            'click #partner': '_onClickPartner',
            'click #portal_category': '_onClickPortalCategory',
            'click #portal_team': '_onClickPortalTeam',
            'change #portal_location': '_onChangePortalLocation',
            'change #portal_subject': '_onChangePortalSubject', // Add event handler for subject change
        },


        /**
         * @override
         */
        start: function () {
            var def = this._super.apply(this, arguments);
            var self = this
            $('#portal_assign_multi_user').select2();

            $.ajax({
                url: "/portal-subcategory-data",
                data: { category_id: $("#portal_category").val() },
                type: "post",
                cache: false,
                success: function (result) {
                    var datas = JSON.parse(result);
                    $("#portal_subcategory > option").remove();
                    $("#portal_subcategory").append('<option value="' + "sub_category" + '">' + "Select Sub Category" + "</option>");
                    _.each(datas.sub_categories, function (data) {
                        $("#portal_subcategory").append('<option value="' + data.id + '">' + data.name + "</option>");
                    });
                },
            });


            $.ajax({
                url: "/portal-partner-data",
                data: {},
                type: "post",
                async: false,
                cache: false,
                success: function (result) {
                    var datas = JSON.parse(result);
                    $("#partner_ids > option").remove();
                    _.each(datas.partners, function (data) {
                        $("#partner_ids").append('<option data-id="' + data.id + '" value="' + data.name + '">');
                    });
                },
            });


            $.ajax({
                url: "/portal-subcategory-data",
                data: { category_id: $("#portal_category").val() },
                type: "post",
                cache: false,
                success: function (result) {
                    var datas = JSON.parse(result);
                    $("#portal_subcategory > option").remove();
                    $("#portal_subcategory").append('<option value="' + "sub_category" + '">' + "Select Sub Category" + "</option>");
                    _.each(datas.sub_categories, function (data) {
                        $("#portal_subcategory").append('<option value="' + data.id + '">' + data.name + "</option>");
                    });
                },
            });

            $.ajax({
                url: "/portal-user-data",
                data: { team_id: $("#portal_team").val() },
                type: "post",
                cache: false,
                success: function (result) {
                    var datas = JSON.parse(result);
                    $("#portal_assign_user > option").remove();
                    $("#portal_assign_user").append('<option value="' + "user" + '">' + "Select Assign User" + "</option>");
                    $("#portal_assign_multi_user").select2('destroy');
                    $("#portal_assign_multi_user > option").remove();
                    $("#portal_assign_multi_user").append('<option value="' + "users" + '">' + "Select Multi Users" + "</option>");
                    _.each(datas.users, function (data) {
                        $("#portal_assign_user").append('<option value="' + data.id + '">' + data.name + "</option>");
                        $("#portal_assign_multi_user").append('<option value="' + data.id + '">' + data.name + "</option>");
                    });
                    $("#portal_assign_multi_user").select2();
                },
            });


            $('body').find('#new_request').on("click", self._onClickNewRequest.bind(self));
            return def
        },


        _onChangePortalFile: function (ev) {

            var input = document.getElementById('portal_file');
            var file = input.files;
            var total_file_size = 0.0

            for (let index = 0; index < file.length; index++) {
                const element = file[index];
                total_file_size = total_file_size + element.size
            }

            if (total_file_size / 1024 > $('#sh_file_size').val()) {
                alert("Attached file exceeds the " + String($('#sh_file_size').val()) + "KB file size limit");
                $("#portal_file").val("");
            }
        },

        _onClickNewRequest: function (ev) {
            $("#createticketModal").modal("show");
        },

        _onClickPortalCategory: function (ev) {
            $.ajax({
                url: "/portal-subcategory-data",
                data: { category_id: $("#portal_category").val() },
                type: "post",
                cache: false,
                success: function (result) {
                    var datas = JSON.parse(result);
                    $("#portal_subcategory > option").remove();
                    $("#portal_subcategory").append('<option value="' + "sub_category" + '">' + "Select Sub Category" + "</option>");
                    _.each(datas.sub_categories, function (data) {
                        $("#portal_subcategory").append('<option value="' + data.id + '">' + data.name + "</option>");
                    });
                },
            });
        },

        _onClickPartner: function (ev) {
            var option = $("#partner_ids").find("[value='" + $("#partner").val() + "']");
            var partner = option.data("id");
            $("#partner_id").val("");
            $("#partner_id").val(partner);
            if ($("#partner_id").val() != "") {
                $.ajax({
                    url: "/selected-partner-data",
                    data: { partner_id: $("#partner_id").val() },
                    type: "post",
                    cache: false,
                    success: function (result) {
                        var datas = JSON.parse(result);
                        $("#portal_contact_name").val(datas.name);
                        $("#portal_email").val(datas.email);
                        $("#portal_mobile").val(datas.mobile);
                    },
                });
            } else {
                $("#portal_contact_name").val("");
                $("#portal_email").val("");
                $("#portal_mobile").val("");
            }
        },

        _onClickPortalTeam: function (ev) {
            $.ajax({
                url: "/portal-user-data",
                data: { team_id: $("#portal_team").val() },
                type: "post",
                cache: false,
                success: function (result) {
                    var datas = JSON.parse(result);
                    $("#portal_assign_user > option").remove();
                    $("#portal_assign_user").append('<option value="' + "user" + '">' + "Select Assign User" + "</option>");
                    $("#portal_assign_multi_user").select2('destroy');
                    $("#portal_assign_multi_user > option").remove();
                    $("#portal_assign_multi_user").append('<option value="' + "users" + '">' + "Select Multi Users" + "</option>");
                    _.each(datas.users, function (data) {
                        $("#portal_assign_user").append('<option value="' + data.id + '">' + data.name + "</option>");
                        $("#portal_assign_multi_user").append('<option value="' + data.id + '">' + data.name + "</option>");
                    });
                    $("#portal_assign_multi_user").select2();
                },
            });
        },

        _onChangePortalLocation: function (ev) {
            var location_id = $("#portal_location").val();
            var self = this;

            // Make an AJAX call to fetch teams based on the selected location
            ajax.jsonRpc('/my/filter_teams', 'call', {'location_id': location_id})
            .then(function (data) {
                // Clear existing options
                $("#portal_team").empty();

                // Append new options based on the received data
                _.each(data.teams, function (team) {
                    $("#portal_team").append($('<option>', {
                        value: team.id,
                        text: team.name
                    }));
                });
            });
        },

        _onChangePortalSubject: function (ev) {
            var subject_name = $("#portal_subject").val();
            var self = this;

            // Make an AJAX call to fetch other information based on the selected subject
            ajax.jsonRpc('/my/filter_other_name', 'call', {'name': subject_name})
            .then(function (data) {
                // Check if the selected subject matches 'Other'
                if (data.is_other) {
                    // Show the 'Other Description' field
                    $('#other_description_field').show();
                    // Add the required attribute to the textarea
                    $('#other_description').prop('required', true);
                } else {
                    // Hide the 'Other Description' field
                    $('#other_description_field').hide();
                    // Remove the required attribute from the textarea
                    $('#other_description').prop('required', false);
                }
            });
        },
    });
});
