var audio;
var playlist;
var tracks;
var current;
var title;
$(document).ready(function(){
  init();
  function init(){
    current = 0;
    audio = $('#audio');
    playlist = $('#playlist');
    title = $("#playertitle");
    instantAnswerobj = $('#instantAnswer');
    tracks = playlist.find('li a');
    len = tracks.length - 1;
    audio[0].volume = .10;
    audio[0].play();
    playlist.find('a').click(function(event){
      link = $(this);
      current = link.parent().index();
      run(link, audio[0]);
      updatetitle($(link),title,instantAnswerobj);
      event.preventDefault();
      return false;
    });
    audio[0].addEventListener('ended',function(e){
      current++;
      if(current == len){
        current = 0;
        link = playlist.find('a')[0];
      }else{
        link = playlist.find('a')[current];
      }
      playlist.animate({scrollTop:$(link).position().top - $('#playlist li:first-child').position().top},"slow");
      run($(link),audio[0]);
      updatetitle($(link),title,instantAnswerobj);
    });
  }
  function run(link, player){
    player.src = link.attr('href');
    par = link.parent();
    par.addClass('active').siblings().removeClass('active');
    link.scrollTop();
    audio[0].load();
    audio[0].play();

  }
  function updatetitle(link,title,instantAnswerobj){
     title.html("Loading id3 tags ...");
    $.get('id3.php',{'url':link.attr('href')}, function(data){
      if(data == 'The MP3 file contains no valid ID3 Tags.'){
        console.log(data);
        title.html("Tags not provided.");
        title.html('Title: '+data.title);
      }else{
        OSDdata= '<ul id="osd"><li>Artist: <a href="https://duckduckgo.com/?q='+data.artist+'" target="_blank" >'+data.artist+'</a></li><li> Title: <a href="https://duckduckgo.com/?q='+data.title+'" target="_blank">'+data.title+'</a></li><li> Album: <a href="https://duckduckgo.com/?q='+data.album+'" target="_blank">'+data.album+'</li></ul>';
        title.html(OSDdata);
        instantAnswer(data.artist,instantAnswerobj);
      }
    },'json');
  }
  function instantAnswer(q,instantAnswerobj){

    instantAnswerobj.html('Loading instant Answer...');
    $.get('ddg.php',{'type':'instantAnswer','q':q},function(data){
      console.log(data);
      if(!$.isEmptyObject(data)){
        instantAnswerobj.html('<ul id="iaul">Abstract: <li id="abstract">'+data.abstract+'</li> Entity: <li id="entity">'+data.entity+'</li>Site: <li>'+data.officialsite+'</li> Related Topics: <li>'+data.relatedTopics[0]+'</li><li>'+data.relatedTopics[1]+'</li></ul>');
      }else{
        instantAnswerobj.html('Oops! Data not provided...');
      }
    },"json");


  }

});
