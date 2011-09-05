$(function () {
    var clip = new ZeroClipboard.Client();
    var currentRow;
    clip.setHandCursor(true);
    clip.addEventListener("onComplete", function () {
        var name = $(".name", currentRow);
        name.animate({ color: '#080' }, 300);
        setTimeout(function () {
            name.animate({ color: '#222' }, 400);
        }, 1000);
    });
    $("a.copy").mouseover(function () {
        var a = $(this);
        var text;
        if (a.hasClass("html")) {
            if (a.hasClass("js")) {
                text = '<' + 'script src="' + a.attr("href") + '" type="text/javascript"></' + 'script>';
            } else { // CSS
                text = '<link href="' + a.attr("href") + '" type="text/css" rel="stylesheet"/>';
            }
        } else { // URL
            text = a.attr("href");
        }
        // set the clip text to our innerHTML
        clip.setText(text);

        // reposition the movie over our element
        // or create it if this is the first time
        if (clip.div) {
            clip.receiveEvent('mouseout', null);
            clip.reposition(this);
        }
        else clip.glue(this);

        // gotta force these events due to the Flash movie
        // moving all around.  This insures the CSS effects
        // are properly updated.
        clip.receiveEvent('mouseover', null);

        document.getElementById(clip.movieId).title = a.attr("title");
        currentRow = $(this).closest("tr");
    });

    $("table tr:odd").addClass("odd");

    (function () {
        var currentHost, table, newRows = [];
        $("tr").each(function () {
            var name = $("a.name", this);
            var text = name.text();
            if (text.match(/(^jquery ui theme -)|(^jquery validate localized -)/i)) {
                var version = $(".version", this).text();
                var host = $(".host", this).text();
                var type = $(".type", this).text();

                var index = text.indexOf('-');
                var folderName = text.substr(0, index);
                name.text(text.substr(index + 1, text.length - index - 4));
                if (currentHost != host) {
                    var toggleRow = $('<tr class="resource group"><td><a class="toggle toggle-icon" href="#"></a></td><td class="name"><a class="toggle" href="#">' + folderName + ' <span class="type">' + type + '</span></a></td><td class="version">' + version + '</td><td class="host">' + host + '</tr>');
                    var tableRow = $('<tr><td> </td><td colspan="3" class="children"><table><tbody></tbody></table></td></tr>');
                    tableRow.hide();
                    table = tableRow.find("tbody");
                    newRows.push(toggleRow, tableRow);
                    currentHost = host;
                }

                table.append(this);
            } else {
                currentHost = null;
                table = null;
            }
        });

        for (var i = 0; i < newRows.length; i++) {
            $("#resources > tbody").append(newRows[i]);
        }
    })();

    $("a.toggle").click(function (e) {
        e.preventDefault();
        var row = $(this).closest("tr").next();
        if (row.is(":visible")) {
            row.hide();
        } else {
            row.css("display", "table-row");
        }
    });

    var rows = $("#resources > tbody > tr.resource");
    $("#filter").keyup(function () {
        var regex = new RegExp($(this).val(), "i");
        rows.each(function () {
            var row = $(this);
            if (regex.test(row.find(".name").text())) {
                row.css("display", "table-row");
            } else {
                row.hide();
            }
        });
    });
});