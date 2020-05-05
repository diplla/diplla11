
var total_size = $( "#total_bytes" ).val();
if(total_size > 0){
    var size_name = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    var i = (Math.floor(Math.log(total_size) / Math.log(1000)))
    var p = Math.pow(1000, i)
    var s = Math.round(total_size / p, 2)
    if(s > 0){
      var final_size = s + " " + size_name[i]
      $( "#attachment_size" ).html(final_size)
    }
}