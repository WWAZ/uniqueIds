 /*
 |--------------------------------------------------------------------------
 | Unique Ids
 |--------------------------------------------------------------------------
 |
 | Creates unique id strings
 | starting from 'aaa' ... 'aab' ... 'ZZZ' ... 'ZZZa' ... infinity
 |
 | Default character depot consists of all upper- and lowercase letters
 | as well as all numbers from 0-9 (= 62 chars). A default id length
 | of 3 characters provides 238.328 possible combinations.
 | (62) x (62) x (62) = 238.328
 |
 | Environmental behavioral differences
 |--------------------------------------------------------------------------
 | Unique ids will be created ...
 | a) Browser: for the length of a request lifecycle
 | b) Node: as long as the server is up (use reset() to start from 'aaa')
 |
 */

const UniqueIds = {


	/**
	 * Initial first id
	 *
	 * @var string
	 */
	initial: 'aaa',


	/**
	 * Sets initial first id
	 *
	 * @var string
	 */
	setInitial: function(str){
		this.initial = str
		this.last = str
	},


	/**
	 * Stores Last provided id
	 *
	 * @var string (this.init = default)
	 */
	last: this.initial,


	/**
	 * Counter for provided ids
	 *
	 * @var number
	 */
	cnt: 0,


	/**
	 * Returns new unique id
	 *
	 * @param none
	 * @return string id
	 */
	make: function(){

		// Split last id into single chars
		let l = this.last.split('');
		// n = length of last string
	 	let n = l.length - 1;

	 	let updated = 0;
	 	let cur, next;

	 	// Start with last char.
	 	// If there's a next character
	 	// in char depot, last letter
	 	// will be replaced.
	 	// 'abc' -> 'abd'
	 	// When there's no next char
	 	// the leftern char will be updated
	 	// and so on.
	 	// 'abz' -> 'aca'
		while (!updated && n > -1) {
			// Set next char
			next = getNext(l[n], n);
			if( next ){
				// We've found next.
				// Update id
				l[n] = next;
				updated = 1;
				// Set all following to first char
				// e.g. 'abz' -> 'aca'
				// e.g. 'azz' -> 'baa'
				let nn = n + 1;
				if( typeof l[nn] !== 'undefined' ){
					for(let i=nn; i < l.length; i++){
						l[i] = getFirst();
					}
				}
			}
			n--;
		}

		if( !updated ){
			// No character was updated, no new id was found
			// extend id length by 1, add first character
			// e.g. ZZZ -> ZZZa
			l.push(getFirst());
		}

		// Convert char arr back to string
		this.last = l.join('');

		// Update counter
		this.cnt++;

		// Return new id
		return this.last;


	 	/**
	   * Returns first character
	   * of Chars
	   *
	   * @param none
	   * @return string first char
	   * @private
	   */
	  function getFirst(){
	  	return getChars().substr(0,1);
	  }


	  /**
	   * Returns next char after given char
	   *
	   * @param string char
	   * @param number index if current char in id
	   * @return string next char
	   * @private
	   */
		 function getNext(char, n){
			 let index = getChars().indexOf(char)
			 let ip = index + 1
			 let next = getChars().split('')[ip]
			 if(typeof next !== 'undefined' ){
				 if( n === 0 && !isNaN(parseInt(next)) ){
					 // We're dealing with the first position
					 // of id. There are no numbers allowed
					 // Return false
					 return false
				 }
				 return next
			 }
			 return false
		 }


		/**
	   * String of characters
	   * as depot for ids
	   *
	   * @param none
	   * @return {string} Chars
	   * @private
	  */
		function getChars(){
			return 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789'
		}
	},

	/**
	 * Sets last id to it's inital value (default = 'aaa')
	 * or to a given string
	 *
	 * @param string str (optional)
	 * @return nothing
	 */
	reset: function(str){
		if( typeof str !== 'undefined' ){
			this.setInitial(str)
		}
		this.last = this.initial
	}

}

module.exports = UniqueIds
