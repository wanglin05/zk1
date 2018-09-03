$(function() {
    $('#ipt').on('input', function() {
        var val = $(this).val();

        if (!val) {
            $('.result').html('');
            return
        } else {
            $.ajax({
                url: './api/search?key=' + val,
                dataType: 'json',
                success: function(res) {
                    console.log(res);
                    if (res.code === 1) {
                        var liStr = '';

                        res.data.forEach(function(item) {
                            liStr += `<li>${item.title}</li>`
                        })
                        $('.result').html(liStr);
                    }
                },
                error: function(error) {
                    console.warn(error);
                }
            })
        }

    })
})