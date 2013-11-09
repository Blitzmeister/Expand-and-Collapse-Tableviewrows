var toggle = 		new ToggleTableViewRows({	tableView: 		$.tblView,
												toggleRows:		[ 'firstname','lastname','email'],
												sectionIndex:	0}); 


/*	Event handler
 * 
 */
function doToggle(e){
	toggle.toggleTableViewRows();
}
//--------------------------------------------------------------------------




/*	Collapse/Expand passed tableview rows 8.11.2013
 * 
 */
function ToggleTableViewRows(_args){
 
	var tableView				= _args.tableView;					//
	var tableViewRowsCopy		= [];
	var toggleTableViewRows		= _args.toggleRows || null;
	var sectionIndex			= _args.sectionIndex || 0;
	var tableViewRowsVisible	= _args.tableViewRowsVisible || true;
	
	
	//Create a deep copy of "tableViewRows" for to keep the order
	//Otherwise call of "deleteRow" would modify/remove array element of "_args.tableView.data[sectionIndex].rows"
	for(var i in _args.tableView.data[sectionIndex].rows){
		tableViewRowsCopy.push(_args.tableView.data[sectionIndex].rows[i]);
	}
	
	this.toggleTableViewRows = function(rowIds){
		if(tableViewRowsVisible){
			this.removeTableViewRowById(rowIds);
		}else{
			this.addTableViewRow(rowIds);
		}
		
		tableViewRowsVisible	=	!tableViewRowsVisible;
	};
	
	//Removes "tableViewRows", beginnging the bottom most
	this.removeTableViewRowById = function(rowIds){
		
		var rowIdsToRemove	= rowIds || toggleTableViewRows;	//Remove rows defined in constructor or passed here ("rowIds") 

		for(var row in toggleTableViewRows){
			
			for(var i = 0; i < _args.tableView.data[sectionIndex].rows.length; i++){
				if(_args.tableView.data[sectionIndex].rows[i].id	== rowIdsToRemove[row]){
					tableView.deleteRow(i);
					i--;
				}
			}
		}
	};
	//----------------------------------------------------------------------
	
	
	//Add the tableViewRows again to the "tableView"
	this.addTableViewRow = function(rowIds){
		
		var rowIdsToAdd	= rowIds || toggleTableViewRows;	//Add rows defined in constructor or passed here ("rowIds") 
		
		var indexOfRowsToInsert	= [];	//Stores the rows which have to be enabled
		
		for(var row in rowIdsToAdd){
			
			for(var tableViewRowId in tableViewRowsCopy){
				if(tableViewRowsCopy[tableViewRowId].id	== rowIdsToAdd[row]){
					indexOfRowsToInsert.push(tableViewRowId);
				}
			}			
		}
		
		
		indexOfRowsToInsert.sort(); 		//Sort the array to ensure that the records get inseted in the corrct order
											//Otherwise it might happen that the position stored in "indexOfRowsToInsert[x]" doesn't fit


		var i				 	= 0;
		var moreRowsToInsert	= true;
		 
		//Use setTimeout/toggle recursion to process the function "toggle" delayed and serilaized
		//It might looks like that the delay execution is not necessary, but anyway without delay the rows get shuffled
		setTimeout(function toggle() {

			//End recursion
		    if (moreRowsToInsert == false) {
		        return;
		    }
		    
		    
		    if(indexOfRowsToInsert[i] <= 0){														//Is the first row to insert the first row in the section
		    	
				if(tableView.data[sectionIndex].rows.length == 0){									//Is the section empty
					tableView.data[sectionIndex].add(tableViewRowsCopy[indexOfRowsToInsert[i]]);	//Add tableviewrow to the section
					 
					var temp = tableView.data; 														//Save the data into a temporary variable
					tableView.setData(temp); 														//Make the tableviewrow visible
				}	else{
					tableView.insertRowBefore(indexOfRowsToInsert[i],tableViewRowsCopy[indexOfRowsToInsert[i]]);	//Add the tableViewRow at the first position in the section
																													//if there are at least one row in the section
				}
			}else if(indexOfRowsToInsert[i]){	
							
				tableView.insertRowAfter(indexOfRowsToInsert[i] - 1, tableViewRowsCopy[indexOfRowsToInsert[i]]);	//Insert row at any position in the section but for first position
			}else{
		        moreRowsToInsert = false;
			}
			
	        setTimeout(toggle, 100);
		        
			i++;

		}, 100);		
		
	};
	//----------------------------------------------------------------------

	//Set rows which get toggled, can set by constructor too
	this.setToggleRows = function(toggleRows){
		toggleTableViewRows	= toggleRows;
	};
}
//--------------------------------------------------------------------------

$.index.open();
