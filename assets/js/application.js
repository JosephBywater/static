$(document).ready(function() {
    $('.simple-tip').tooltip({position: 'top', delay: 25})
    $('.dropdown-button').dropdown();

    if($('.sandbox-container').length) {
        $('button[data-sb-action]').on('click', function(e) {
            e.preventDefault();

            if(!$('.sandbox-container .step1').hasAttr('complete')) {
                var action = $(this).attr('data-sb-action');
                
                $('.sandbox-container .step1').attr('complete', 'true');

                $('button[data-sb-action!="' + action + '"]').stop().fadeOut(700, function() {
                    if(action == 'ping' || action == 'favicon' || action == 'blacklist') {
                        $('.sb-param[data-param="server"]').show();
                    }

                    $('.sandbox-container .step2').stop().slideDown(300);
                });
            }

            return false;
        });

        $('.sandbox-container .step2 .sb-param').on('keyup', function() {
            onSandboxParamType($(this));
        }).on('paste', function() {
            onSandboxParamType($(this));
        }).on('focus', function() {
            onSandboxParamType($(this));
        }).on('blur', function() {
            onSandboxParamType($(this));
        });

        function onSandboxParamType(e) {
            if($('.sandbox-container .step1').hasAttr('complete'))
            var text = e.text();

            if(text && text.length > 1) {
                // update code snippet
            } else {
                // reset code snippet
            }
        }
    }

    if($('button.docs-btn[data-ajax]').length && $('.response#docs-ajax-response').length) {
        $('button.docs-btn[data-ajax').on('click', function(e) {
            var ele = $(this);
            e.preventDefault();

            $('#docs-ajax-response').text('Please wait...');

            $.ajax({
                url: '/v3/' + ele.attr('data-ajax') + '/' + ele.attr('data-ajax-arg'),
                type: 'get',
                async: true,
                success: function(data, textStatus, obj) {
                    var resp = typeof data == 'object' ? JSON.stringify(data, null, 4) : '<img src="/v3/' + ele.attr('data-ajax') + '/' + ele.attr('data-ajax-arg') +'">';
                    $('.response#docs-ajax-response').html('<kbd class="response-heading">Headers</kbd><p>' + obj.getAllResponseHeaders() + '</p><kbd class="response-heading">Response</kbd><p>' + resp + '</p>');
                    $('html, body').animate({
                        scrollTop: $('.response#docs-ajax-response').offset().top - 130
                    }, 300);
                },
                error: function(e1, e2, e3) {
                    $('.response#docs-ajax-response').text('An unexpected error occured, please try again later!');
                }
            })
        });
    }

    if($('form[data-action="new_campaign"]').length) {
        $('form[data-action="new_campaign"]').on('submit', function(e) {
            e.preventDefault();
            $('#create-error').stop().slideUp(200);

            $.ajax({
                url: '/campaigns',
                type: 'post',
                data: $(this).serialize(),
                success: function(resp) {
                    if(resp.status == 200) {
                        $('#create-error').html('<strong>Campaign created!</strong> We are redirecting you to PayPal now..').removeClass('red').addClass('green').slideDown(350);
                        window.location.href = resp.paymentUrl;
                    } else {
                        $('#create-error').stop().html('<strong>Error:</strong> ' + resp.error).slideDown(250);
                    }
                },
                error: function(e1, e2, e3) {
                    console.log(e1, e2, e3);
                    $('#create-error').stop().html('<strong>Error:</strong> An error occured while processing that request!').slideDown(250);
                }
            })

            return false;
        });
    }
});

function isImgurLink(str) {
    var match = str.toLowerCase().match('((https:\/\/)|(http:\/\/)*)((i.)|(m.)|(www.))*(imgur.com)[\/].+');
    return !match ? false : match.length > 0;
}

$.fn.hasAttr = function(name) {  
   return this.attr(name) !== undefined;
};