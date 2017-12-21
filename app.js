// Create the client
var client = Asana.Client.create().useAccessToken('0/4248c0b5b808da10a3a51ab2aa8205ea');

// Globals are not best, but i didn't want to over engineer this project
var projectId = getUrlParameter("project");
var userId = null;
var workspaceId = null;

// Access User
client.users.me()
// Find Users Project
.then(function(user){
    userId = user.id;
    workspaceId = user.workspaces[0].id;
    return client.projects.findById(projectId);
})
// Append Project name to HTML
.then(function(project){
    let projectName = project.name;

    $("#projectName").append(projectName);
})
// Find Project Details
.then(function(){

    return client.tasks.findAll({
        project: projectId,
        opt_fields: 'id,name,assignee_status,completed'
    });
})
// Pulling the Tasks from the Response
.then(function(response){

    return response.data;
})
// Append each Task to HTML
.then(function(tasks){
    for(key in tasks) {
        let task = tasks[key];
        let li = $("<li></li>");
        let x = $('<a class="hideItem">HIDE<a>');
        let taskName = $('<a class="itemText">' + task.name + "</a>");

        // add a link to the original task
        taskName.attr("href", "https://app.asana.com/0/"+ projectId + "/" + task.id + "/f");

        x.on("click", function(){
            li.hide();
        });

        li.append(x);
        li.append(taskName);
        $("#tasks").append(li);

    }
});

// query parameter
// https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
