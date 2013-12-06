﻿function IndexViewModel() {
    var self = this;

    var getActiveTab = function() {
        var tab = sessionStorage.getItem('environment_ActiveTab');
        return tab;
    };

    var storeActiveTab = function(tab) {
        sessionStorage.setItem('environment_ActiveTab', tab);
    };
    
    self.changedTab = function(tab) {
        storeActiveTab(tab.Id());
    };

    self.environments = ko.observableArray();

    self.getAgentStatus = function(agent) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/agent/details/' + agent.Id(),
            dataType: 'json',
            contentType: 'application/json'
        }).done(function () {
            agent.Status("Online");
        }).fail(function () {
            agent.Status("Offline");
        });
    };

    self.build = function () {
        $.ajax({
            type: 'GET',
            url: '/api/v1/environment/',
            dataType: 'json',
            contentType: 'application/json'
        }).done(function (data) {
            $.each(data, function (i, d) {
                for (var j in d.Agents) {
                    d.Agents[j].Status = "";
                };
                var inst = ko.mapping.fromJS(d);
                self.environments.push(inst);
                for (var j in inst.Agents()) {
                    self.getAgentStatus(inst.Agents()[j]);
                };
            });
            $('#agents li:nth-child(4n+1)').css('margin-left', '0');
            var tab = getActiveTab() || '';
            if (tab === '')
                $('#envTabs a:first').tab('show');
            else
                $('#tab_' + tab).tab('show');
        }).fail(function (msg) {
            toastr.error('Failed to get environments', 'Error');
        });
    };
}