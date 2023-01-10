(function ($) {
  $.fn.smsCodeInput = function (method) {
    if (typeof method === 'string') {
      if (method === 'clear') {
        this.each(function () {
          $(this)
            .val('')
            .next('.field-exploded-wrapper')
            .remove();
          $(this).next('.field-exploded-error').remove();
          $(this).trigger('change');
        });
      }
    }

    // Скроем оригинальное поле
    this.hide();
    this.addClass('exploded');

    // Создадим нужную разметку
    this.each(function () {
      var $input = $(this);

      if (!$input.next().hasClass('field-exploded-wrapper')) {
        explode_field($input);
      }
    });

    function explode_field($input) {
      var maxlength = parseInt($input.attr('maxlength') || $input.data('maxlength'));

      // Создадим псевдо-инпуты
      $input.after($('<div />').addClass('field-exploded-wrapper'));

      $input.next('.field-exploded-wrapper').append($('<div />')
        .addClass('field-exploded')
        .addClass('field-input-exploded')
      );

      $input.next('.field-exploded-wrapper').find('.field-exploded')
        .after($('<div />')
          .addClass('field-exploded-error')
          .hide()
        );

      if (!isNaN(maxlength)) {
        for (var i = 0; i < maxlength; i++) {
          $input.next().find('.field-input-exploded').append($('<input />')
            .attr({
              type: "text",
              maxlength: 1,
              inputmode: "numeric",
              pattern: "[0-9]*"
            })
          );
        }
      }
    }
  }
  // Обработка событий
  $(document)
    .off('.field-exploded')
    .on('input.field-exploded', '.field-exploded input', function (event) {
      if (getPlatformArm() === 'arm') {
        // todo решить обработку событий для Android-приложений
        $(event.target).trigger('focus:change');
      }
    })
    .on('keydown.field-exploded', '.field-exploded', function (event) {
      var $target = $(event.target),
        $parentContainer = $(event.currentTarget);

      event.preventDefault();

      if (!~['text', 'password'].indexOf($target.attr('type'))) {
        return;
      }

      if (!isNaN(parseInt(event.key))) {
        // Если ввели с клавиатуры цифровое значение
        $parentContainer.find('input').each(function () {
          var $this = $(this);

          if (!$this.val().length) {
            $this.val(event.key)
              .trigger('change');

            return false;
          }
        });
      } else if (!!~[8, 46].indexOf(event.which || event.keyCode)) {
        // Backspace || Delete
        $($parentContainer.find('input').get().reverse()).each(function () {
          var $this = $(this);
          if ($this.val()) {
            $this.val('').trigger('change');

            return false;
          }
        })
      }
    })
    .on('focus:change.field-exploded', '.field-exploded input', function (event) {
      var $target = $(event.target);

      if ($target.val()) {
        $target.addClass('is-filled');
        $target.next().focus();
      } else {
        $target.removeClass('is-filled');
        $target.focus();
      }

      // Для Android
      if (!$target.next().length) {
        $target.blur();
      }
    })

})(jQuery);

$(document).ready(function () {
  var inputCode = $('input[data-rule-confirm-sms]');
  inputCode.smsCodeInput();

  $('.activate-card__about').click(function () {
    $('.activate-card__about svg').toggleClass('active');
    $('.activate-card__content').slideToggle(300, function () {});
    return false;
  });

  function showPopupByName(name) {
    let popupNode = $("#" + name);
    if (!popupNode.length) return;

    let tmp;
    // add close-icon
    if (!popupNode.find("span.popup__close-mobile").length) {
      tmp = popupNode
        .children()
        .eq(0)
        .append('<span class="popup__close-mobile"></span>');
    }
    popupNode.on("click touchstart", function (e) {
      if (
        e.target.className == "popup__win popup-on" ||
        e.target.className == "popup__close-mobile"
      ) {
        $("html").removeClass("popup-show");
        popupNode.removeClass("popup-on");
        return false;
      }
    });
    if (!popupNode.find("span.popup__close-desktop").length) {
      tmp = popupNode
        .children()
        .eq(0)
        .append('<span class="popup__close-desktop"></span>');
    }
    popupNode.on("click touchstart", function (e) {
      if (
        e.target.className == "popup__win popup-on" ||
        e.target.className == "popup__close-desktop"
      ) {
        $("html").removeClass("popup-show");
        popupNode.removeClass("popup-on");
        return false;
      }
    });

    // click on link - open win

    // if show active popup - close her
    $("span.popup__close:visible").trigger("click");
    $("html").addClass("popup-show");
    popupNode.addClass("popup-on");
  }

  $('.color-card__mcc-text').on('click', function (event) {
    event.preventDefault();
    showPopupByName('popupId-01')
  });

  var sec = 30;

  function pad(val) {
    return val > 0 ? val : "30" - val;
  }
  setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(--sec % 60);
  }, 1000);
  // if (sec = 0) {
  //   document.getElementById("seconds") = 0;
  // }

  // function () {
  //   if (sec = 0) {

  //   }
  // }
});