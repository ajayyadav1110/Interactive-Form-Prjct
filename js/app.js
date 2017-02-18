/*javascript*/
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 /* The following line is to get rid of an error in webstorm */
  /*globals $:false */
(function () {
  "use strict";
  var $name = $("#name");
  var $mail = $("#mail");
  var $payment = $("#payment");

  var nameError = false;
  var emailError = false;
  var activityError = true;
  var paymentError = false;
  var creditCardError = false;
  var zipError = false;
  var cvvError = false;

  var errors = [];


/*Set focus on the first text field
When the page loads, give focus to the first text field*/    
  document.getElementById("name").focus();
  
  // Set the credit card expiration month to November -- I realize that this is brittle and just a temporary fix
  // Of course, the credit card information section would need to be much more robust to be "live"
  $('#exp-month option[value=11]').attr('selected','selected');



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*”Job Role” section of the form:
A text field that will be revealed when the "Other" option is selected from the "Job Role" drop down menu.
Give the field an id of “other-title,” and add the placeholder text of "Your Job Role" to the field.*/
$("#other-title").addClass("is-hidden");
$("#title").change(function(){
    if ($("#title").val() === "other") {
      $("#other-title").removeClass("is-hidden");
    } else {
      $("#other-title").addClass("is-hidden");
    }
  });




//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*”T-Shirt Info” section of the form:
For the T-Shirt color menu, only display the color options that match the design selected in the "Design" menu.
If the user selects "Theme - JS Puns" then the color menu should only display "Cornflower Blue," "Dark Slate Grey," and "Gold."
If the user selects "Theme - I ♥ JS" then the color menu should only display "Tomato," "Steel Blue," and "Dim Grey."*/
$("#color").addClass("is-hidden");
var $option1=$('<option value="cornflowerblue">Cornflower Blue (JS Puns shirt only)</option>')
$("#design").on("click" ,function(){
var designSelection = $("#design").val();
$('#color').removeClass('is-hidden');
    if (designSelection === "js puns")  {
      $('#color')
        .find('option').remove().end()
        .append('<option value="cornflowerblue">Cornflower Blue (JS Puns shirt only)</option>')
        .append('<option value="darkslategrey">Dark Slate Grey (JS Puns shirt only)</option>')
        .append('<option value="gold">Gold (JS Puns shirt only)</option>')
      ;

    }
 else if (designSelection === "heart js") {
      $('#color').find('option').remove().end()
        .append('<option value="tomato">Tomato (I &#9829; JS shirt only)</option>')
        .append('<option value="steelblue">Steel Blue (I &#9829; JS shirt only)</option>')
        .append('<option value="dimgrey">Dim Grey (I &#9829; JS shirt only)')
      ;
    }	
  });


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*”Register for Activities” section of the form:
Some events are at the same time as others. If the user selects a workshop, don't allow selection of a workshop at the same date and time --
 you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.
When a user unchecks an activity, make sure that competing activities (if there are any) are no longer disabled.
As a user selects activities, a running total should display below the list of checkboxes. 
For example, if the user selects "Main Conference", then Total: $200 should appear. If they add 1 workshop, the total should change to Total: $300.*/

  var activities = [];

  var totalCost = 0.00;

  if (activities.length > 0) {
    $(".total").removeClass("is-hidden");
  } else {
    $(".total").addClass("is-hidden");
  }

  $("input[type=checkbox]").each(function () {
    $(this).change(function () {

      var activity = $(this).attr("name");
      var sametype = $(this).attr("dtype");
      var percost = parseInt($(this).attr("cost"));

      var sameconfrence = $(' input[dtype="' + sametype + '"] ');
      var sameconfrenceNotchecked = sameconfrence.not(':checked');

      if ($(this).is(":checked")) {

        sameconfrenceNotchecked.prop("disabled", true);
        sameconfrenceNotchecked.parent().addClass("unavailable-activity");

        activities.push(activity);
        totalCost += percost;

      } else {

        var index = $.inArray(activity, activities);
        activities.splice(index, 1);

        totalCost -= percost;
        sameconfrenceNotchecked.prop("disabled", false);
        sameconfrenceNotchecked.parent().removeClass("unavailable-activity");

      }

      if (activities.length > 0) {
        $(".total").removeClass("is-hidden");
      } else {
        $(".total").addClass("is-hidden");
      }
      $('.dollar-amt').text(totalCost);

    });
  });



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*Payment Info section of the form:
Display payment sections based on the payment option chosen in the select menu
The "Credit Card" payment option should be selected by default, display the #credit-card div, and hide the "Paypal" and "Bitcoin information.
When a user selects the "PayPal" payment option, the Paypal information should display, and the credit card and “Bitcoin” information should be hidden.
When a user selects the "Bitcoin" payment option, the Bitcoin information should display, and the credit card and “PayPal” information should be hidden.*/


$("#paypal").addClass("is-hidden");
  $("#bitcoin").addClass("is-hidden");

  $("#payment").change(function () {

    var paymentType = $(this).val();
    console.log(paymentType);
    if (paymentType === "credit card") {
      $("#credit-card").removeClass();
      //$("#cc-num").focus();
      $("#bitcoin").addClass("is-hidden");
      $("#paypal").addClass("is-hidden");
    } else if (paymentType === "paypal") {
      $("#credit-card").addClass("is-hidden");
      $("#bitcoin").addClass("is-hidden");
      $("#paypal").removeClass();
      $("#demo-message").remove();
    } else if (paymentType === "bitcoin") {
      $("#credit-card").addClass("class", "is-hidden");
      $("#bitcoin").removeClass();
      $("#paypal").addClass("is-hidden");
      $("#demo-message").remove();
    }
  });

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*Form validation:
If any of the following validation errors exist, prevent the user from submitting the form:
Name field can't be blank
Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: 
dave@teamtreehouse.com for example.
Must select at least one checkbox under the "Register for Activities" section of the form.
If the selected payment option is 
"Credit Card," make sure the user has supplied a credit card number, a zip code, and a 3 number CVV value before the form can be submitted.
Credit card field should only accept a number between 13 and 16 digits
The zipcode field should accept a 5-digit number
The CVV should only accept a number that is exactly 3 digits long*/

$("#registration-form").submit(function () {

    var $errorSummary = $("#error-summary");

    // clear all errors
    errors = [];
    $errorSummary.remove();

    // start validation checks
    if (!nameIsValid()) {
      errors.push("Enter a name.");
      nameError = true;
    }
    if (!emailIsValid()) {
      errors.push("Enter a valid email.");
      emailError = true;
    }
    if (activities.length <= 0) {
      errors.push("Select at least one activity.");
      activityError = true;
    }
    if ($("#payment").val() === "select_method") {
      errors.push("Select a payment method.");
      paymentError = true;
    }
    if ($payment.val() === "credit card") {

      if (!creditCardIsValid()) {
        errors.push("Enter a credit card number.");
        creditCardError = true;
      }
      if (!(zipIsValid())) {
        errors.push("Enter a 5 digit zip code.");
        zipError = true;
      }
      if (!(cvvIsValid())) {
        errors.push("Enter a 3 digit cvv.");
        cvvError = true;
      }
    }

    if (errors.length > 0) {
      var $errorDiv = "<div id='error-summary'><h5>Please correct the following error(s)</h5></div>";
      var $form = $("#registration-form");
      $form.prepend($errorDiv);
      $("h5").append($("<ul id='error-list'></ul>"));

      for (var i=0; i < errors.length; i++) {
        $("#error-list").append($("<li>" + errors[i] + "</li>"));
      }

      // scroll to the top of the page to display the errors
      scroll(0,0);
      return false;
    }
    else {
      // clean up errors
      errors = [];
      $errorSummary.remove();

      console.log("submit success");
      alert("Successfully registered!");
      return true;
    }
  });

  /* --------------------------------------------------------------------------

   Individual validation checks for form fields.

   ----------------------------------------------------------------------------- */
  // Check that the name is valid (must be at least 1 character)
  function nameIsValid() {
    var nameValue = $name.val();
    return (nameValue.length > 0  && !$.isNumeric(nameValue)) ;
  }

  // Check that email is valid
  function emailIsValid() {

    var myPattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    var emailValue = $mail.val();

    var isValid = emailValue.search(myPattern) >= 0;
    return (isValid);
  }

  // Basic check to see that the credit card number field is filled out. This does not check if the number is valid.
  function creditCardIsValid() {
    return ($("#cc-num").val() > 0);
  }

  function zipIsValid() {
    var zipcode = $('#zip').val();
    return ($.isNumeric(zipcode) && zipcode.length === 5);
  }

  function cvvIsValid() {
    var cvv = $("#cvv").val();
    return ( $.isNumeric(cvv) && cvv.length === 3);
  }

})();

