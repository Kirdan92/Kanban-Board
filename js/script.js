'use strict';
(function(){ 


//Loading of DOM tree
document.addEventListener('DOMContentLoaded', function() {
	var wrapper = document.querySelector('.wrapper');
	var overlay = document.querySelector('.overlay');
	var	modal = document.querySelector('.confirm-modal');

	//Function generating id from 10 randomly selected signs
    function randomString() {
	    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
	    var str = '';
	    for (var i = 0; i < 10; i++) {
	        str += chars[Math.floor(Math.random() * chars.length)];
	    }
	    return str;
	}
	//HTML elements creation
	function generateTemplate(name, data, basicElement) {
	  var template = document.getElementById(name).innerHTML;
	  var element = document.createElement(basicElement || 'div');

	  Mustache.parse(template);
	  element.innerHTML = Mustache.render(template, data);

	  return element;
	}

	var container = {
	    name: 'Board Container',
	    addBoard: function(board) {
	      this.element.appendChild(board.element);
	    },
	    element: document.querySelector('.wrapper')
	};

	document.querySelector('.button-container .btn-new-board').addEventListener('click', function() {
		container.addBoard(new Board(prompt("Enter the name of the board")));
		document.querySelector('.button-container').classList.add("hide");
	});

	function generateBoard(name, data) {
	  var template = document.getElementById(name).innerHTML;
	  Mustache.parse(template);
	  wrapper.innerHTML += Mustache.render(template, data);
	  console.log(wrapper.childNodes)
	  return wrapper;
	
	}

	function Board(name) {
		var self = this;

		this.id = randomString();
		this.name = name;
		this.parent = generateBoard('board-template', { name: this.name, id: this.id });
		this.element = this.parent.childNodes[3];
		//Events
		this.parent.addEventListener('click', function() {
			event.stopPropagation();
			if (event.target.classList.contains('create-column')) {
	    		self.addColumn(new Column(prompt("Enter a column name")));
	    		
	    	}
	    	if (event.target.classList.contains('btn-delete')) {
	    		overlay.classList.add("show");
    			modal.addEventListener('click', function (event) {
				  	if (event.target.classList.contains('btn-yes')) {
				    	self.removeBoard("yes");
				    	overlay.classList.remove("show");
				    	document.querySelector('.button-container').classList.remove("hide");
				    	location.reload(); // DO odswiezenia event lsitenera
				    }	
			    	if (event.target.classList.contains('btn-no')) {
			    		overlay.classList.remove("show");
			    	}
		  		});
		  	}
		});

	}


	Board.prototype = {
		addColumn: function(column){
		    this.element.querySelector('.column-container').appendChild(column.element);
		    initSortable(column.id);
		    console.log('rrrr')
	    },  
	    removeBoard: function(decision) {
	    	if(decision == "yes") {
		      	this.element.parentNode.removeChild(this.element);
		      	
      		} else {
	      		return;
	      	}	      
		}
	}
	//Column class
	function Column(name) {
	  	var self = this;

	  	this.id = randomString();
	  	this.name = name;
	  	this.element = generateTemplate('column-template', { name: this.name, id: this.id });

	  	//Events
		//1. Remove column on button click
		this.element.querySelector('.column').addEventListener('click', function (event) {
		  	if (event.target.classList.contains('btn-delete-col')) {
		    	self.removeColumn(); //self bo to jest funkcja przekazywana jako parametr addEventListener()
		  	}
			//2. Add column on button click  
		  	if (event.target.classList.contains('add-card')) {
			    self.addCard(new Card(prompt("Enter the name of the card")));
		  	}
		});
	}
	//Column prototypes
	Column.prototype = {
	    addCard: function(card) {
	      this.element.querySelector('ul').appendChild(card.element); //div.column ul i podpinanie karty appendChild pole element z obiekt card
	    },
	    removeColumn: function() {
	      this.element.parentNode.removeChild(this.element);
	    }
	};

	//Column class
	function Card(description) {
		var self = this;

		this.id = randomString();
		this.description = description;
		this.element = generateTemplate('card-template', { description: this.description }, 'li');

		//Enents
		this.element.querySelector('.card').addEventListener('click', function (event) {
		  	event.stopPropagation();

		  	if (event.target.classList.contains('btn-delete')) {
			    self.removeCard();
		  	}
		});
	}
	Card.prototype = {
		removeCard: function() {
			this.element.parentNode.removeChild(this.element);
	    }
	}

	function initSortable(id) {
	  	var el = document.getElementById(id);
	  	console.log(el);
	  	var sortable = Sortable.create(el, {
		    group: 'kanban',
		    sort: true
	  	});
	}



	//CREATE BOARD
	/*
	var firstBoard = new Board('First');

	// CREATING COLUMNS
	var todoColumn = new Column('To do');
	var doingColumn = new Column('Doing');
	var doneColumn = new Column('Done');

	// ADDING COLUMNS TO THE BOARD
	firstBoard.addColumn(todoColumn);
	firstBoard.addColumn(doingColumn);
	firstBoard.addColumn(doneColumn);

	// CREATING CARDS
	var card1 = new Card('New task');
	var card2 = new Card('Create kanban boards');

	// ADDING CARDS TO COLUMNS
	todoColumn.addCard(card1);
	doingColumn.addCard(card2);
	*/
});


})(); 