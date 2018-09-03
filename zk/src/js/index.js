$(function() {
    $.ajax({
        url: './api/list',
        dataType: 'json',
        success: function(res) {
            console.log(res);
            if (res.code === 1) {
                var str = '';
                res.data.forEach(function(item) {
                    str += '<p>' + item.tit + '</p>'
                })
            }
        },
        error: function(error) {
            console.warn(error);
        }
    })
})