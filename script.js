$(function(){

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function randomBeep(){
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();

    osc.type = "sawtooth";
    osc.frequency.value = 200 + Math.random()*1200; // random beep pitch

    gain.gain.value = 0.2; // constant volume (no fade)

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05); // very short click beep
  }

  var colorArray = [
    {value: 470, text: "470", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-13px -13px"},
    {value: 750, text: "750", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-13px -132px"},
    {value: 1000, text: "1000", free_spin: "1", img: "luck_board_low_res.jpg", pos: "-582px -134px"},
    {value: 1000, text: "1000", free_spin: "1", img: "luck_board_low_res.jpg", pos: "-582px -134px"},
    {value: 1000, text: "1000", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-469px -136px"},
    {value: 1200, text: "1200", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-13px -252px"},
    {value: 1500, text: "1500", free_spin: "1", img: "luck_board_low_res.jpg", pos: "-468px -251px"},
    {value: 1500, text: "1500", free_spin: "1", img: "luck_board_low_res.jpg", pos: "-468px -251px"},
    {value: 1750, text: "1750", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-13px -372px"},
    {value: 2000, text: "2000", free_spin: "1", img: "luck_board_low_res.jpg", pos: "-468px -374px"},
    {value: 2000, text: "2000", free_spin: "1", img: "luck_board_low_res.jpg", pos: "-468px -374px"},
    {value: 2750, text: "2750", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-126px -492px"},
    {value: 3000, text: "3000", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-239px -492px"},
    {value: 3500, text: "3500", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-470px -492px"},
    {value: 4000, text: "4000", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-582px -492px"},
    {value: 4000, text: "4000", free_spin: "0", img: "luck_board_low_res.jpg", pos: "-582px -492px"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
    {value: -1, text: "WHAMMY", free_spin: "0", img: "whammy2.png"},
  ];

  var input = document.getElementById("input");
  var score = 0;
  var spins = 2;
  var arraySelection;
  var $rows = [];
  var chosenCel;
  var whammyCount = 0;

  function blink(){
    randomBeep(); // <-- play beep every spin step

    $rows = $('.cel');
    $rows.removeClass('flash').removeAttr("style").html("");

    $rows.each(function(){
      arraySelection = colorArray[Math.floor(Math.random()*colorArray.length)];

      if (arraySelection.value == -1) {
        $(this).css("background-image", "url(img/" + arraySelection.img + ")")
          .attr('value', arraySelection.value)
          .attr('free_spin', arraySelection.free_spin);
      } else {
        $(this).css("background-image", "url(img/" + arraySelection.img + ")")
          .css('background-position', arraySelection.pos)
          .css('background-size', "800px 600px")
          .attr('value', arraySelection.value)
          .attr('free_spin', arraySelection.free_spin);
      }
    });

    chosenCel = $rows[Math.floor(Math.random()*$rows.length)];
    $(chosenCel).addClass('flash');
  }

  function start() {
    $(chosenCel).removeClass('flash');
    clearTimeout(flash);
    add = setInterval(blink,100); // 0.1 second spin
    $('#spins').html('<p>Spins: ' + spins + '</p>');
  }

  function checkFreeSpin(){
    clickedCel = chosenCel.attributes.value.value;

    if (clickedCel == -1){
      score = 0;
      spins -= 1;
      addWhammys();
    } else if (chosenCel.attributes.free_spin.value == 1) {
      score += parseInt(clickedCel);
      spins += 1;
    } else {
      score += parseInt(clickedCel);
    }
  }

  function addWhammys(){
    $('.whammyPic').eq(whammyCount).css('background-image', "url(img/whammy2.png)");

    if (whammyCount == 2){
      $('#celMiddle').html("<p>GAME OVER. CLICK BELOW To RESTART</p>");
      $('#start').text('RESTART').on('click', reset());
    } else {
      whammyCount++;
    }
  }

  function stop(){
    clearInterval(add);
    checkFreeSpin();

    $('#score').text("$ " + score);
    flash(chosenCel, 5, 100);
  }

  function flash(elem, times, speed) {
      if (times > 0 || times < 0) {
          if ($(elem).hasClass("flash"))
              $(elem).removeClass("flash");
          else
              $(elem).addClass("flash");
      }

      if (times > 0 || times < 0) {
          setTimeout(function () {
              flash(elem, times, speed);
          }, speed);
          times -= .5;
      }
  }

  function reset(){
    score = 0;
    spins = 2;
    $rows = [];
    whammyCount = 0;
  }

  $('#target').on('click',function(){
    if($(this).attr('data-click-state') == 1) {
      $(this).attr('data-click-state', 0)
      stop(event);
    } else {
      $(this).attr('data-click-state', 1)
      start(event);
    }
  });

});
