$(document).ready(function(){

    // ************************************************
    // Shopping Cart API
    // ************************************************
    
    var shoppingCart = (function() {
        // =============================
        // Private methods and properties
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
        displayCart();
      });
      
      // Clear items
      $('.clear-cart').click(function() {
        shoppingCart.clearCart();
        displayCart();
      });
    
      // Check out items
      $('.check-out').click(function(){
        window.location.href='checkout.html';
        checkOutCart();
      });
    
      //Send Order
      $('.send-order').click(function(){
        window.location.href='sendorder.html';
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
            
            if ((transcript == "clear name")
                    || (transcript == " clear name")
                    || (transcript == " Clear name")
                    || (transcript == " clear Name")
                    || (transcript == " Clear Name")) {
                      $('#name').val("");
            }
            else if ((transcript == "clear address")
                    || (transcript == " clear address")
                    || (transcript == " Clear address")
                    || (transcript == " clear Address")
                    || (transcript == " Clear Address")) {
                      $('#address').val("");
            }
            else if ((transcript == "clear number")
                    || (transcript == " clear number")
                    || (transcript == " Clear number")
                    || (transcript == " clear Number")
                    || (transcript == " Clear Number")) {
                      $('#phone-no').val("");
            }
            else if (!$('#name').val()) {
                $('#name').val(transcript);
            }
            else if (!$('#address').val()) {
                $('#address').val(transcript);
            }
            else if (!$('#phone-no').val()) {
                $('#phone-no').val(transcript);
            }
            else if ((transcript == "make order")
                    || (transcript == "order now")
                    || (transcript == " order now")) {
                $('.send-order').trigger('click');
            }
        }
    
        $("#start-btn").click(function(event){
            if(content.length){
                content += '';
            }
    
            recognition.start();
        });
}); 
