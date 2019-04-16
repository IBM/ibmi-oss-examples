// IE trouble?
// $.support.cors = true;
// view for index.html
$(document).ready(function() {
  // currency
  var currencyFormat = function (amount) {
    // mmm ... not all support Intl.NumberFormat ... hack
    return "$" + parseFloat(amount).toFixed(2);
  }
  // RPG search case sensitive (first letter upper case)
  var capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // ==============================
  // fill drop down select menus
  // ==============================
  // fill flights list (selectmenu)
  // {airline:info[0],flight:info[1],dow:info[2],cityfrom:info[3],cityto:info[4],timefrom:info[5],timeto:info[6],price:info[7]}
  var flight400_fill_flight_list = function(result, list) {
    list.empty();
    list.append("<option>-- select --</option>");
    $.each(result, function (i, flight) {
        var option_flights = '<option>'
          + flight['flight'] + ':'
          + " " + flight['cityfrom'] 
          + " " + flight['timefrom'] 
          + " " + flight['cityto'] 
          + " " + flight['timeto']
          + " " + currencyFormat(flight['price'])
          + '</option>';
        list.append(option_flights);
      }); // each
    list.selectmenu( "refresh" );
  }
  // fill orders list (selectmenu)
  // {order:info[0],customer:info[1],depart:info[1]}
  var flight400_fill_order_list = function(result, cust, list) {
    list.empty();
    list.append("<option>-- select --</option>");
    sorted = [];
    $.each(result, function (i, info) {
        if (cust == info['customer']) {
          // mm/dd/yy
          var dd1 = info['depart'];
          var ds1 = dd1.split("/");
          var yymmdd = ds1[2]+ "/" + ds1[0] + "/" + ds1[1];
          sorted.push(yymmdd + ":" + info['order']);
        }
    });
    sorted.sort();
    sorted.reverse();
    sorted.forEach(function(info) {
        var option_orders = '<option>'
          + info 
          + '</option>';
        list.append(option_orders);
      }); // each
    list.selectmenu( "refresh" );
  }
  // fill class list (selectmenu)
  var flight400_seat_class = ["Coach","Business","First"];
  var flight400_fill_class_list = function(classes, list) {
    list.empty();
    $.each(classes, function (i, fclass) {
        var option_class = '<option>'
          + fclass
          + '</option>';
        list.append(option_class);
      }); // each
    list.selectmenu( "refresh" );
  }
  // ==============================
  // tabs
  // ==============================
  $('#tabs').tabs({ selected: 0 });
  // any message
  var flight400_any_message = function(msgArea, query) {
    if (query.responseJSON) {
      msgArea.text(JSON.stringify(query.responseJSON.message));
    } else {
      msgArea.text(JSON.stringify(query.statusText));
    }
  }
  // ==============================
  // customer (flight 400 tab)
  // ==============================
  $("#flight400_customer").autocomplete({
    source: function( request, response ) {
      clear_customer(true);
      var look = capitalizeFirstLetter(request.term);
      var find = "/flight400/api/customers/"+look;
      $.getJSON(find, function(query) {
        var flight400_data = [];
        $.each(query.result, function (i, data) {
          flight400_data.push(data['customer']);
        });
        var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( look ), "i" );
        response( $.grep(flight400_data, function( item ){
          return matcher.test( item );
        }) );
      }) 
      .error(function(query) { flight400_any_message($('#flight400_customer_msg'), query); });
    },
    open: function (result) {
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        $('.ui-autocomplete').off('menufocus hover mouseover');
      }
    },    
    select: function( event, ui ) {
      var stext = ui.item.value;
      var find2 = "/flight400/api/customer/"+stext;
      $.getJSON(find2, function(query) {
        $('#flight400_custid').text(query.result);
      }) 
      .error(function(query) { flight400_any_message($('#flight400_customer_msg'), query); });
    },
    minLength: 1
  });
  var clear_customer = function(flagCustomer) {
    if (flagCustomer) {
      $("#flight400_customer").empty();
      $("#flight400_custid").text("");
      clear_history(true);
    }
    $('#flight400_customer_msg').text("");
  }
  // ==============================
  // orders (flights tab)
  // ==============================
  $("#flight400_order_list").selectmenu({
    change: function( event, ui ) {
      var stext = $("#flight400_order_list option:selected").text();
      var order = stext.split(':');
      var find = "/flight400/api/order/"+order[1];
      clear_history(false);
      $.getJSON(find, function(query) {
        // {agent:info[0],custid:info[1],flight:info[2],datefrom:info[3],timefrom:info[4],tickets:info[5],service:info[6],order:info[7]}
        var info = query.result;
        if (info['order']) {
          $('#flight400_history_agent').text(info['agent']);
          $('#flight400_history_custid').text(info['custid']);
          var find1 = "/flight400/api/customer/"+info['custid'];
          $.getJSON(find1, function(query) {
            $('#flight400_history_customer').text(query.result);
           }) 
          .error(function(query) { flight400_any_message($('#flight400_customer_msg'), query); });
          $('#flight400_history_flight').text(info['flight']);
          $('#flight400_history_datefrom').text(info['datefrom']);
          // $('#flight400_history_timefrom').text(info['timefrom']);
          $('#flight400_history_tickets').text(info['tickets']);
          $('#flight400_history_service').text(info['service']);
          $('#flight400_history_order').text(info['order']);
          var find2 = "/flight400/api/flight/"+info['flight'];
          $.getJSON(find2, function(query) {
            // {airline:info[0],flight:info[1],dow:info[2],cityfrom:info[3],cityto:info[4],timefrom:info[5],timeto:info[6],price:info[7]};
            var info2 = query.result;
            $('#flight400_history_airline').text(info2['airline']);
            $('#flight400_history_cityfrom').text(info2['cityfrom']);
            var find3 = "/flight400/api/city/"+info2['cityfrom'];
            $.getJSON(find3, function(query) {
              $('#flight400_history_cityfrom').text(query.result);
            }) 
            .error(function(query) { flight400_any_message($('#flight400_customer_msg'), query); });
            $('#flight400_history_timefrom').text(info2['timefrom']);
            $('#flight400_history_cityto').text(info2['cityto']);
            var find4 = "/flight400/api/city/"+info2['cityto'];
            $.getJSON(find4, function(query) {
              $('#flight400_history_cityto').text(query.result);
            }) 
            .error(function(query) { flight400_any_message($('#flight400_customer_msg'), query); });
            $('#flight400_history_timeto').text(info2['timeto']);
          }) 
          .error(function(query) { flight400_any_message($('#flight400_customer_msg'), query); });
        }
      }) 
      .error(function(query) { flight400_any_message($('#flight400_history_msg'), query); });
    }
  });
  $('#flight400_history').button({
    create: function(e) {
      $(e.target).click(function(ev) {
        ev.preventDefault();
        clear_history(true);
        var stext = $("#flight400_customer").val();
        var count = 100;
        var find = "/flight400/api/orders/"+stext+"/"+count;
        $.getJSON(find, function(query) {
          flight400_fill_order_list(query.result, stext, $('#flight400_order_list'));
        }) 
        .error(function(query) { flight400_any_message($('#flight400_history_msg'), query); });
      })
    }
  });
  var clear_history = function(flagList) {
    if (flagList) {
      $('#flight400_order_list').empty();
      $('#flight400_order_list').selectmenu( "refresh" );
    }
    $('#flight400_history_agent').text("");
    $('#flight400_history_custid').text("");
    $('#flight400_history_customer').text("");
    $('#flight400_history_flight').text("");
    $('#flight400_history_datefrom').text("");
    $('#flight400_history_timefrom').text("");
    $('#flight400_history_tickets').text("");
    $('#flight400_history_service').text("");
    $('#flight400_history_order').text("");
    $('#flight400_history_airline').text("");
    $('#flight400_history_cityfrom').text("");
    $('#flight400_history_timefrom').text("");
    $('#flight400_history_cityto').text("");
    $('#flight400_history_timeto').text("");
    $('#flight400_history_msg').text("");
  }
  // ==============================
  // depart (depart tab)
  // ==============================
  $("#flight400_depart_from").autocomplete({
    source: function( request, response ) {
      var look = capitalizeFirstLetter(request.term);
      var find = "/flight400/api/cities/"+look+"/from";
      clear_depart(false,false,true);
      $.getJSON(find, function(query) {
        var flight400_data = [];
        $.each(query.result, function (i, data) {
          flight400_data.push(data['city']);
        });
        var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( look ), "i" );
        response( $.grep(flight400_data, function( item ){
          return matcher.test( item );
        }) );
      }) 
      .error(function(query) { flight400_any_message($('#flight400_depart_msg'), query); });
    },
    open: function (result) {
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        $('.ui-autocomplete').off('menufocus hover mouseover');
      }
    },    
    select: function( event, ui ) {
      clear_depart(false,false,true);
    },
    change: function( event, ui ) {
      clear_depart(false,false,true);
      clear_return(true,true,true);
    },
    minLength: 1
  });
  $("#flight400_depart_to").autocomplete({
    source: function( request, response ) {
      clear_depart(false,false,true);
      var look = capitalizeFirstLetter(request.term);
      var find = "/flight400/api/cities/"+look+"/to";
      $.getJSON(find, function(query) {
        var flight400_data = [];
        $.each(query.result, function (i, data) {
          flight400_data.push(data['city']);
        });
        var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( look ), "i" );
        response( $.grep(flight400_data, function( item ){
          return matcher.test( item );
        }) );
      }) 
      .error(function(query) { flight400_any_message($('#flight400_depart_msg'), query); });
    },
    select: function( event, ui ) {
      clear_depart(false,false,true);
    },
    change: function( event, ui ) {
      clear_depart(false,false,true);
      clear_return(true,true,true);
    },
    minLength: 1
  });
  $("#flight400_depart_date").datepicker({
    onSelect: function(d,i){
      clear_depart(false,false,false);
      var find = "/flight400/api/flights/"
               +$("#flight400_depart_from").val()
               +"/"+$("#flight400_depart_to").val()
               +"/"+$("#flight400_depart_date").val();
      $.getJSON(find, function(query) {
        flight400_fill_flight_list(query.result, $('#flight400_depart_list'));
      }) 
      .error(function(query) { flight400_any_message($('#flight400_depart_msg'), query); });
    }
  });
  $("#flight400_depart_list").selectmenu({
    change: function( event, ui ) {
      var stext = $("#flight400_depart_list option:selected").text();
      var fclass = $("#flight400_depart_class option:selected").text();
      var flight = stext.split(':');
      var price = stext.split('$');
      var find = "/flight400/api/price/"+price[1]+"/"+fclass;
      $('#flight400_depart_msg').text("");
      $.getJSON(find, function(query) {
        flight400_fill_depart_price(query.result, flight[0]);
      }) 
      .error(function(query) { flight400_any_message($('#flight400_depart_msg'), query); });
    }
  });
  $("#flight400_depart_class").selectmenu({
    change: function( event, ui ) {
      var stext = $("#flight400_depart_list option:selected").text();
      var fclass = $("#flight400_depart_class option:selected").text();
      var flight = stext.split(':');
      var price = stext.split('$');
      var find = "/flight400/api/price/"+price[1]+"/"+fclass;
      $('#flight400_depart_msg').text("");
      $.getJSON(find, function(query) {
        flight400_fill_depart_price(query.result, flight[0]);
      }) 
      .error(function(query) { flight400_any_message($('#flight400_depart_msg'), query); });
    }
  });
  flight400_fill_class_list(flight400_seat_class, $("#flight400_depart_class"));
  var clear_depart = function(flagCityFrom, flagCityTo, flagDate) {
    if (flagCityFrom) $("#flight400_depart_from").val("");
    if (flagCityTo) $("#flight400_depart_to").val("");
    if (flagDate) $("#flight400_depart_date").val("");
    $('#flight400_depart_list').empty();
    $('#flight400_depart_msg').text("");
    $('#flight400_depart_flight').text("");
    $('#flight400_depart_price').text("");
    $('#flight400_depart_tax').text("");
    $('#flight400_depart_cost').text("");
    $('#flight400_depart_list').selectmenu( "refresh" );
    $('#flight400_total_depart_flight').text("");
    $('#flight400_total_return_flight').text("");
    $('#flight400_total_price').text("");
    $('#flight400_total_tax').text("");
    $('#flight400_total_cost').text("");
    $('#flight400_total_msg1').text("");
    $('#flight400_total_msg2').text("");
  }
  // ==============================
  // return (return tab)
  // ==============================
  $("#flight400_return_from").autocomplete({
    source: function( request, response ) {
      clear_return(false,false,true);
      var look = capitalizeFirstLetter(request.term);
      var find = "/flight400/api/cities/"+look+"/from";
      $.getJSON(find, function(query) {
        var flight400_data = [];
        $.each(query.result, function (i, data) {
          flight400_data.push(data['city']);
        });
        var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( look ), "i" );
        response( $.grep(flight400_data, function( item ){
          return matcher.test( item );
        }) );
      }) 
      .error(function(query) { flight400_any_message($('#flight400_return_msg'), query); });
    },
    select: function( event, ui ) {
      clear_return(false,false,true);
    },
    minLength: 1
  });
  $("#flight400_return_to").autocomplete({
    source: function( request, response ) {
      clear_return(false,false,true);
      var look = capitalizeFirstLetter(request.term);
      var find = "/flight400/api/cities/"+look+"/to";
      $.getJSON(find, function(query) {
        var flight400_data = [];
        $.each(query.result, function (i, data) {
          flight400_data.push(data['city']);
        });
        var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( look ), "i" );
        response( $.grep(flight400_data, function( item ){
          return matcher.test( item );
        }) );
      }) 
      .error(function(query) { flight400_any_message($('#flight400_return_msg'), query); });
    },
    select: function( event, ui ) {
      clear_return(false,false,true);
    },
    minLength: 1
  });
  $("#flight400_return_date").datepicker({
    onSelect: function(d,i){
      clear_return(false,false,false);
      var find = "/flight400/api/flights/"
               +$("#flight400_return_from").val()
               +"/"+$("#flight400_return_to").val()
               +"/"+$("#flight400_return_date").val();
      $.getJSON(find, function(query) {
        flight400_fill_flight_list(query.result, $('#flight400_return_list'));
      }) 
      .error(function(query) { flight400_any_message($('#flight400_return_msg'), query); });
    }
  });
  $("#flight400_return_list").selectmenu({
    change: function( event, ui ) {
      var stext = $("#flight400_return_list option:selected").text();
      var fclass = $("#flight400_return_class option:selected").text();
      var flight = stext.split(':');
      var price = stext.split('$');
      var find = "/flight400/api/price/"+price[1]+"/"+fclass;
      $('#flight400_return_msg').text("");
      $.getJSON(find, function(query) {
        flight400_fill_return_price(query.result, flight[0]);
      }) 
      .error(function(query) { flight400_any_message($('#flight400_return_msg'), query); });
    }
  });
  $("#flight400_return_class").selectmenu({
    change: function( event, ui ) {
      var stext = $("#flight400_return_list option:selected").text();
      var fclass = $("#flight400_return_class option:selected").text();
      var flight = stext.split(':');
      var price = stext.split('$');
      var find = "/flight400/api/price/"+price[1]+"/"+fclass;
      $('#flight400_return_msg').text("");
      $.getJSON(find, function(query) {
        flight400_fill_return_price(query.result, flight[0]);
      }) 
      .error(function(query) { flight400_any_message($('#flight400_return_msg'), query); });
    }
  });
  flight400_fill_class_list(flight400_seat_class, $("#flight400_return_class"));
  var clear_return = function(flagCityFrom, flagCityTo, flagDate) {
    if (flagCityFrom) $("#flight400_return_from").val($("#flight400_depart_to").val());
    if (flagCityTo) $("#flight400_return_to").val($("#flight400_depart_from").val());
    if (flagDate) $("#flight400_return_date").val("");
    $('#flight400_return_list').empty();
    $('#flight400_return_msg').text("");
    $('#flight400_return_flight').text("");
    $('#flight400_return_price').text("");
    $('#flight400_return_tax').text("");
    $('#flight400_return_cost').text("");
    $('#flight400_return_list').selectmenu( "refresh" );
    $('#flight400_total_depart_flight').text("");
    $('#flight400_total_return_flight').text("");
    $('#flight400_total_price').text("");
    $('#flight400_total_tax').text("");
    $('#flight400_total_cost').text("");
    $('#flight400_total_msg1').text("");
    $('#flight400_total_msg2').text("");
  }
  // ==============================
  // reserve (book tab)
  // ==============================
  var flight400_order = function (flt) {
    // {"agent":"1","custid":"9340","flight":"4113661","datefrom":"03/11/04","timefrom":"07:05 AM","tickets":"1","service":"C"}
    // Babcock, Adrian:3350
    var csv = $("#flight400_customer").val();
    var csi = $("#flight400_custid").text();
    if (csv && csi) {
      var order_cust = csi;
      // 0          1 2        3   4     5  6   7     8  9
      // 07/26/2017 C 7157580: RCH 07:33 AM DFW 09:33 AM $169.00
      var flv = flt.text();
      if (flv) {
        var fs = flv.split(" ");
        if (fs[5]) {
          var order_date = fs[0];
          var order_class = fs[1];
          var fn = fs[2].split(":");
          var order_flight = fn[0];
          var order_time = fs[4] + " " + fs[5];
          return {agent:1,custid:Number(order_cust),flight:order_flight,datefrom:order_date,timefrom:order_time,tickets:1,service:order_class};
        } else {
          return {error:"flight"};
        }
      } else {
        return {error:"flight"};
      }
    }
    return {error:"customer"};
  }
  $('#flight400_book').button({
    create: function(e) {
      $(e.target).click(function(ev) {
        ev.preventDefault();
        var csv = $("#flight400_customer").val();
        var csi = $("#flight400_custid").text();
        $('#flight400_total_msg1').text("");
        $('#flight400_total_msg2').text("");
        var find = "/flight400/api/reserve";
        var order1 = flight400_order($('#flight400_total_depart_flight'));
        var order2 = flight400_order($('#flight400_total_return_flight'));
        if (order1['flight'] && order2['flight']) {
          $.post(find, order1, function(query) {
            $('#flight400_total_msg1').text("Depart order: " + query.result + " id:" + csi + " " + csv); 
          }) 
          .error(function(query) { flight400_any_message($('#flight400_total_msg1'), query); });
          $.post(find, order2, function(query) {
            $('#flight400_total_msg2').text("Return order: " + query.result + " id:" + csi + " " + csv); 
          }) 
          .error(function(query) { flight400_any_message($('#flight400_total_msg2'), query); });
        } else {
           if (!order1['flight']) {
             $('#flight400_total_msg1').text("Error depart flight" + " id:" + csi + " " + csv);
           }
           if (!order2['flight']) {
             $('#flight400_total_msg2').text("Error return flight" + " id:" + csi + " " + csv);
           }
        }
      })
    }
  });
  // ==============================
  // price (book tab)
  // ==============================
  // fill price
  var flight400_fill_price = function(info, fnbr, flight, price, tax, total) {
    flight.text(fnbr);
    price.text(currencyFormat(info['price']));
    tax.text(currencyFormat(info['tax']));
    total.text(currencyFormat(info['total']));
  }
  var flight400_fill_total_price = function() {
    var f1 = $("#flight400_depart_list option:selected").text().split('$');
    var f2 = $("#flight400_return_list option:selected").text().split('$');

    var c1 = $("#flight400_depart_class option:selected").text().substr(0,1);
    var c2 = $("#flight400_return_class option:selected").text().substr(0,1);

    var dd1 = $("#flight400_depart_date").val();
    var d1 = "";
    if (dd1) {
      var ds1 = dd1.split("/");
      d1 = ds1[0] + "/" + ds1[1] + "/" + ds1[2].substr(2,3);
    } else {
      c1 = "";
    }
    var dd2 = $("#flight400_return_date").val();
    var d2 = "";
    if (dd2) {
      var ds2 = dd2.split("/");
      d2 = ds2[0] + "/" + ds2[1] + "/" + ds2[2].substr(2,3);
    } else {
      c2 = "";
    }

    var price = 0.00;
    var price1 = +($('#flight400_depart_price').text().replace(/[$,]+/g,""));
    var price2 = +($('#flight400_return_price').text().replace(/[$,]+/g,""));
    var flight1 = d1 + " " + c1 + " " + f1[0] + " " + currencyFormat(price1);
    var flight2 = d2 + " " + c2 + " " + f2[0] + " " + currencyFormat(price2);
    $('#flight400_total_depart_flight').text(flight1);
    $('#flight400_total_return_flight').text(flight2);
    if (typeof price1 === "number") price += price1;
    if (typeof price2 === "number") price += price2;
    $('#flight400_total_price').text(currencyFormat(price));

    var tax = 0.00;
    var tax1 = +($('#flight400_depart_tax').text().replace(/[$,]+/g,""));
    var tax2 = +($('#flight400_return_tax').text().replace(/[$,]+/g,""));
    if (typeof tax1 === "number") tax += tax1;
    if (typeof tax2 === "number") tax += tax2;
    $('#flight400_total_tax').text(currencyFormat(tax));

    var cost = 0.00;
    var cost1 = +($('#flight400_depart_cost').text().replace(/[$,]+/g,""));
    var cost2 = +($('#flight400_return_cost').text().replace(/[$,]+/g,""));
    if (typeof cost1 === "number") cost += cost1;
    if (typeof cost2 === "number") cost += cost2;
    $('#flight400_total_cost').text(currencyFormat(cost));
  }
  var flight400_fill_depart_price = function(info, fnbr) {
      flight400_fill_price(info, fnbr, 
        $('#flight400_depart_flight'),
        $('#flight400_depart_price'),
        $('#flight400_depart_tax'),
        $('#flight400_depart_cost'));
      flight400_fill_total_price();
  }
  var flight400_fill_return_price = function(info, fnbr) {
      flight400_fill_price(info, fnbr, 
        $('#flight400_return_flight'),
        $('#flight400_return_price'),
        $('#flight400_return_tax'),
        $('#flight400_return_cost'));
      flight400_fill_total_price();
  }
}); // ready

