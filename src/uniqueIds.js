const UniqueIds = {
	/**
	 * Last id provided
	 * and starting id at the same time
	 * Defines also the length of all
	 * provided ids
	 * {string} last
	 */
	last: 'aaa',
	/**
	 * Counts number of provided ids
	 * {number} cnt
	 */
	cnt: 0,
	/**
	 * Returns new id
	 *
	 * @param none
	 * @return {string} id
	 * @public
	 */
	new: function(){

		// Split into single chars
		let l = this.last.split('');
		// n = length of last string
	 	let n = l.length - 1;
	 	// If string was updates (new id was found)
	 	// updated = 1
	 	let updated = 0;
	 	let cur, next;

	 	// Start with last char
	 	// If there's a next character
	 	// in char depot, last letter
	 	// will be replaced
	 	// 'abc' -> 'abd'
	 	// If there's no next char
	 	// the leftern char will be updated
	 	// and so on
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
		    l.push(getFirst());
	  	}

	  	this.last = l.join('');

	  	// Update counter
	  	this.cnt++;

	  	return this.last;

	  	/**
	  	 * Returns random id 4 digits
	  	 * as backup in case of
	  	 * Chars maximum is reached
	  	 *
	  	 * @param none
	  	 * @return {string} random id
	  	 * @private
	  	 */
	  	function getRandomId(){
	  		return pConfUtil.makeid(4);
	  	}

	 	/**
	  	 * Returns first character
	  	 * of Chars
	  	 *
	  	 * @param none
	  	 * @return {string} first char
	  	 * @private
	  	 */
	  	function getFirst(){
	  		return getChars().substr(0,1);
	  	}

	  	/**
	  	 * Returns next char after given char
	  	 *
	  	 * @param {string} char
	  	 * @param {number} index if current char in id
	  	 * @return {string} next char
	  	 * @private
	  	 */
	  	function getNext(char, n){
	  		let index = getChars().indexOf(char);
	    	let ip = index + 1;
	    	let next = getChars().split('')[ip];
	    	if(typeof next !== 'undefined' ){

	    		if( n === 0 && !isNaN(parseInt(next)) ){
	    			// We're dealing with the first position
	    			// of id. There are no numbers allowed
	    			// Return false
		    		return false;
		    	}
	    		return next;
	    	}
	    	return false;
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
	  		//return 'abc'; // Testing errors
	  		// 3 should be enough?: (52+10) x (52+10) x (52+10) = 238.328 possible combinations
			return 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789';
			// 3 should be enough?: 26 x 26 x 26 = 17.576 possible combinations
	  		return 'abcdefghijklmnopqrstuvwxyz';
		}

	},
	/**
	 * Adds id if not existing
	 *
	 * @param {string} id
	 * @return {string}
	 * - same id, if it's new
	 * - or new id
	 * @deprecated
	 * @public
	 */
	addIfNew: function(id){
		return this.new();

	},
	/**
	 * Adds id
	 *
	 * @param {string} id
	 * @return {boolean} true on success
	 * @deprecated
	 * @public
	 */
	add: function(id){
		return this.new();
		//@deprecated
	}


}

module.exports = UniqueIds
