$(document).ready(function(){


  

// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
    // =============================
    // Private methods and propeties
    // =============================
    cart = [];
    
    // Constructor
    function Item(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }
    
    // Save cart
    function saveCart() {
      sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
    
      // Load cart
    function loadCart() {
      cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }

    if (sessionStorage.getItem("shoppingCart") != null) {
      loadCart();
    }
    
  
    // =============================
    // Public methods and properties
    // =============================
    var obj = {};
    
    // Add to cart
    obj.addItemToCart = function(name, price, count) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count ++;
          saveCart();
          return;
        }
      }
      var item = new Item(name, price, count);
      cart.push(item);
      saveCart();
    }
    // Set count from item
    obj.setCountForItem = function(name, count) {
      for(var i in cart) {
        if (cart[i].name === name) {
          cart[i].count = count;
          break;
        }
      }
    };
    // Remove item from cart
    obj.removeItemFromCart = function(name) {
        for(var item in cart) {
          if(cart[item].name === name) {
            cart[item].count --;
            if(cart[item].count === 0) {
              cart.splice(item, 1);
            }
            break;
          }
      }
      saveCart();
    }
  
    // Remove all items from cart
    obj.removeItemFromCartAll = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart.splice(item, 1);
          break;
        }
      }
      saveCart();
    }
  
    // Clear cart
    obj.clearCart = function() {
      cart = [];
      saveCart();
    }
  
    // Count cart 
    obj.totalCount = function() {
      var totalCount = 0;
      for(var item in cart) {
        totalCount += cart[item].count;
      }
      return totalCount;
    }
  
    // Total cart
    obj.totalCart = function() {
      var totalCart = 0;
      for(var item in cart) {
        totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
    }
  
    // List cart
    obj.listCart = function() {
      var cartCopy = [];
      for(i in cart) {
        item = cart[i];
        itemCopy = {};
        for(p in item) {
          itemCopy[p] = item[p];
  
        }
        itemCopy.total = Number(item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy)
      }
      return cartCopy;
    }
  
    // cart : Array
    // Item : Object/Class
    // addItemToCart : Function
    // removeItemFromCart : Function
    // removeItemFromCartAll : Function
    // clearCart : Function
    // countCart : Function
    // totalCart : Function
    // listCart : Function
    // saveCart : Function
    // loadCart : Function
    return obj;
})();
  
  
  // *****************************************
  // Triggers / Events
  // ***************************************** 
  // Add item
  $('.add-to-cart').click(function(event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    shoppingCart.addItemToCart(name, price, 1);
	speak(name,price,1);
    displayCart();
  });
  
  // Clear items
  $('.clear-cart').click(function() {
    shoppingCart.clearCart();
	speak("","",2);
    displayCart();
  });

	// dispaly-cart
  $('.display-cart').click(function() {
	var cartArray = shoppingCart.listCart();
	speakCart(cartArray);
  });
  
  // read-menu
  $('.read-menu').click(function() {
    speakMenu();
  });
  
  // Check out items
  $('.check-out').click(function(){
    window.location.href='checkout.html';
	speak("","",7); 
    checkOutCart();
  });

  //Send Order
  $('.send-order').click(function(){
    window.location.href='sendorder.html';
	console.log("here");
	speak("","",6);
  });
  
  
  function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for(var i in cartArray) {
      output += "<tr>"
        + "<td>" + cartArray[i].name + "</td>" 
        + "<td>(" + cartArray[i].price + ")</td>"
        + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name='" + cartArray[i].name + "'>-</button>"
        + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
        + "<button class='plus-item btn btn-primary input-group-addon' data-name='" + cartArray[i].name + "'  data-price="+ cartArray[i].price +"'>+</button></div></td>"
        + "<td><button class='delete-item btn btn-danger' data-name='" + cartArray[i].name + "'>X</button></td>"
        + " = " 
        + "<td>" + cartArray[i].total + "</td>" 
        +  "</tr>";
        //console.log($('.minus-item').data('name'));
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
  }

  // display cart in checkout
  function checkOutCart(){
    var cartArray = shoppingCart.listCart();
    var output = "";
    for(var i in cartArray) {
        output += "<tr>"
          + "<td>" + cartArray[i].name + "</td>" 
          + "<td>Price: " + cartArray[i].price + "TL</td>"
          + "<td> Total Price: " + cartArray[i].total + "TL</td>" 
          +  "</tr>";
      }
  
    $('.your-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
  }
  
  // Delete item button
  
  $('.show-cart').on("click", ".delete-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
	speak(name,"",5);
    displayCart();
  });
  
  
  // -1
  $('.show-cart').on("click", ".minus-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCart(name);
	speak(name,"",4);
    displayCart();
  });

  // +1
  $('.show-cart').on("click", ".plus-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.addItemToCart(name);
	speak(name,"",3);
    displayCart();
  });
  
  // Item count input
  $('.show-cart').on("change", ".item-count", function(event) {
     var name = $(this).data('name');
     var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
  });
  
  displayCart();
  checkOutCart();

  // ************************************************
  // Web Speech API Speech Recognition
  // ************************************************

  var speechRecognition = window.webkitSpeechRecognition;

    var recognition = new speechRecognition();

    var textbox = $("#textbox");
    var instructions = $("#instructions");

    var content = '';

    recognition.continuous = true;

    //when speech is detected

    recognition.onstart = function(){
        instructions.text("Voice Recognition is on");
    }


    //If you go long without saying anything
    recognition.onspeechend = function(){
        instructions.text("No Activity");
    }


    //On error with recognition
    recognition.onerror = function(){
        instructions.text("Try Again");
    }

    recognition.onresult = function(event){
        var current  = event.resultIndex;

        var transcript = event.results[current][0].transcript;

        content += transcript;
        textbox.val(content);
        console.log(transcript);

        if ((transcript == 'add chicken burger')
              || (transcript == ' add chicken burger')
              || (transcript == ' chicken burger')
              ) {
            $('#add-chicken-burger').trigger('click');
        }
        else if((transcript == 'add cheese burger')
              || (transcript == ' add cheese burger')
              || (transcript == ' cheese burger')
              ){
          $('#add-cheese-burger').trigger('click');
        }
        else if((transcript == 'add double cheese burger')
              || (transcript == ' add double cheese burger')
              || (transcript == ' add double cheeseburger')
              || (transcript == ' double cheeseburger')
              ){
          $('#add-double-cheese-burger').trigger('click');
        }
        else if((transcript == 'add fish burger')
              || (transcript == ' add fish burger')
              || (transcript == ' fish burger')
              ){
          $('#add-fish-burger').trigger('click');
        }
        else if((transcript == 'add vegan burger')
              || (transcript == ' add vegan burger')
              || (transcript == ' vegan burger')
              ){
          $('#add-vegan-burger').trigger('click');
        }
        else if((transcript == 'open cart')
              || (transcript == ' open cart')
              || (transcript == ' opencart')
              || (transcript == ' open')){
          $('#open-cart').trigger('click');
        }
        else if((transcript == 'clear the cart')
              || (transcript == ' clear the cart')){
          $('.clear-cart').trigger('click');
        }
        else if((transcript == 'close cart')
              || (transcript == ' close cart')
              || (transcript == ' close')
              || (transcript == 'close')
              || (transcript == 'Close')
              || (transcript == ' Close')
              || (transcript == ' close the cart')
              || (transcript == 'close the cart')){
          $('#close-btn').trigger('click');
        }
        else if((transcript == 'checkout')
              || (transcript == ' checkout')
              || (transcript == ' Checkout')
			        || (transcript == ' Check out')
			        || (transcript == ' check out')
              || (transcript == ' go to checkout')
              || (transcript == ' go to check out')
              || (transcript == ' Go to checkout')){
          $('.check-out').trigger('click');
        }
		else if((transcript == 'read menu')
              || (transcript == 'menu')){
          $('.read-menu').trigger('click');
        }
    }

    $("#start-btn").click(function(event){
        if(content.length){
            content += '';
        }

        recognition.start();
    });
	
	//-------------------------------------------------//
	// ************************************************
	// Web Speech API Speech Recognition
	// ************************************************
	var synth = window.speechSynthesis;

	function speak(name,price,flag){
		if (synth.speaking) {
			console.error('speechSynthesis.speaking');
			return;
		}
		var speech;
		
		if (flag === 1)
			speech = "A " + name + "with price" + price + "Turkish Lira Has been added to the cart";
		else if (flag === 2)
			speech = "The Cart is Empty now";
		else if (flag === 3)
			speech = "A" + name + "has been added to the cart";
		else if (flag === 4)
			speech = "A" + name + "has been removed from the cart";
		else if (flag === 5)
			speech = "All" + name + "S have been removed from the cart";
		else if (flag === 6)
			speech = "Your Order has been made";
		else if (flag === 7)
			speech = "Please fill in the necessary information to complete the order";
		
		
		var utterThis = new SpeechSynthesisUtterance(speech);
		utterThis.onend = function (event) {
			console.log('SpeechSynthesisUtterance.onend');
		}
		utterThis.onerror = function (event) {
			console.error('SpeechSynthesisUtterance.onerror');
		}
		// var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
		// for(i = 0; i < voices.length ; i++) {
		  // if(voices[i].name === selectedOption) {
			// utterThis.voice = voices[i];
			// break;
		  // }
		// }
		utterThis.pitch = 1;
		utterThis.rate = 1;
		synth.speak(utterThis);	
	}


	function speakCart(list){
		if (synth.speaking) {
			console.error('speechSynthesis.speaking');
			return;
		}
		//console.log(name,price,count,flag);
		var speech;
		
		var utterThis = new SpeechSynthesisUtterance("Your cart has the following Items");
		utterThis.pitch = 1;
		utterThis.rate = 1;
		synth.speak(utterThis);
		
		for (var i in list)
		{
			speech = list[i].count + list[i].name + "with price" + list[i].total + "Turkish Lira";
			utterThis = new SpeechSynthesisUtterance(speech);
		
		
			utterThis.onend = function (event) {
				console.log('SpeechSynthesisUtterance.onend');
			}
			utterThis.onerror = function (event) {
				console.error('SpeechSynthesisUtterance.onerror');
			}
		
			utterThis.pitch = 1;
			utterThis.rate = 1;
			synth.speak(utterThis);
		}
		var total = shoppingCart.totalCart();
		speech = "The total you need to pay is" + total + "Turkish Lira" + "Click on checkout to proceed";
		var utterThis = new SpeechSynthesisUtterance(speech);
		utterThis.pitch = 1;
		utterThis.rate = 1;
		synth.speak(utterThis);
	}
	
	function speakMenu() {
			
		if (synth.speaking) {
		console.error('speechSynthesis.speaking');
		return;
		}	
		
		var menu = ['Welcome to Burger Hut',
				'The menu of our restaurant is as follows',
				'Cheese Burger with price 30 Turkish Lira',
				'Double Cheese Burger with price 40 Turkish Lira',
				'Fish Burger with price 40 Turkish Lira',
				'Chicken Burger with price 35 Turkish Lira',
				'Vegan Burger with price 70 Turkish Lira'];
		for (var i in menu)
		{
			
			var speech = menu[i];
			
			var utterThis = new SpeechSynthesisUtterance(speech);


			utterThis.onend = function (event) {
				console.log('SpeechSynthesisUtterance.onend');
			}
			utterThis.onerror = function (event) {
				console.error('SpeechSynthesisUtterance.onerror' + event.error);
			}
			console.log(menu[i]);
			utterThis.pitch = 1;
			utterThis.rate = 1;
			synth.speak(utterThis);
		}
	}

//-------------------------------------------------//
}); 