Fig.prototype.gridmesh = function(x,y,vals,options)
{
	/*
		A method to create a simple html5 canvas meshed value contour
		// assumes time on the x axis
        Inputs:
            x = the values keying the horizontal portion of the data
            y = the values keying the vertical portion of the data
            vals = a 2 dimensional array corresponding to the values to be plotted
            options = a standard object with specifications to be listed later.
	*/

	// now, clear the entire plot, for simplicity
	this.clearPlot();

	// and begin working the data!	
	count = vals.length;
	x_vals = x.length;
	y_vals = y.length; // ASSUMES A PERFECT GRID!!

	// define a list of values, keyed with the range, similar to how the colorbar works
	dy = y[y.length - 1] - y[0];
	y_unitsize = this.h/dy;
	// now define the list of y 'height' values in the grid space
	y_size = [];
	for (i in y)
	{
		i = i*1;
		// determine the distance in y-units between it an the next
		if (i == y.length - 1)
		{
			// then this is the end, and assume the last one equals the
			// second to last one
			dv = y[i] - y[i-1];
		}
		else
		{
			dv = y[i+1] - y[i];
		}
		// ok, then we can determine the ith bin height by dv * y_unitsize
		y_size.push(dv*y_unitsize);
	}
	// do the same for x!
	dx  = x[x.length - 1] - x[0]; // the range of values observed in X
	x_unitsize = this.w/dx;
	x_size = [];
        for (j in x)
        {
		j = j * 1;
		k = j + 1;
                // determine the distance in y-units between it an the next
                if (j == x.length - 1)
                {
                        // then this is the end, and assume the last one equals the
                        // second to last one
                        dv = x[j] - x[j-1];
                }
                else
                {
                        dv = x[k] - x[j];
                }
                // ok, then we can determine the ith bin height by dv * y_unitsize
                x_size.push(dv*x_unitsize);
        }
	// now we have arrays for the size of each x unit!
	width = (this.w/count); // the box width in pixels

	/* MOVING THIS TO A LABELS CLASS!
	///////////////// X LABELS, a total of 6!
	// labels every width*count/4
	numticks_x = 4
	for (i=0;i<=count;i=i+((count-1)/numticks_x))
	{
		// at position i*width(x) 10(y) place the value x[i]
		// FIXME - this is assuming that x is time - make label object
		t = new Date(x[Math.round(i)]*1000);
		ts = digit(t.getUTCHours())+":"+digit(t.getUTCMinutes()); // only hh:mm no :ss
		this.ctx.fillStyle="#000000";
		this.ctx.fillText(ts,i*width*.97 + this.y_label_offset - 10,this.h + 20);
		// and add a tick
		this.ctx.lineWidth = 2;
		this.ctx.lineCap = 'butt'; //hehe
		this.ctx.strokeStyle = "#000000";
		this.ctx.moveTo(Math.round(i*width)+this.y_label_offset,this.h + 12);
		this.ctx.lineTo(Math.round(i*width)+this.y_label_offset,this.h);
		this.ctx.stroke();
	}
	// Y LABELS either interval or number
	numticks = 5; //fixme - make an option
	dy = (y[y.length - 1]  - y[0])/numticks;
	for (i=0;i<y[y.length -1];i=i+500) // 500 interval
	{
		// so, we are able to assume monotonically increasing values
		// and use the y_unitsize to determine the position
		t = parseInt(i); // define the text
		position = this.h - i*y_unitsize;
		this.ctx.strokeStyle = "#000000";
		this.ctx.fillText(t,3,position);
		
		
	}
	*/
	// BORDERS
	if (!options||options.border != 'none')
	{
		// create a border
		this.ctx.beginPath();
		this.ctx.moveTo(this.y_label_offset-1,0);
		this.ctx.closePath();
		this.ctx.lineTo(this.y_label_offset-1,this.h+2);
		this.ctx.stroke();
		// bottom border - dangit.
		this.ctx.beginPath();
		this.ctx.moveTo(this.w+this.y_label_offset ,this.h+1);
		this.ctx.closePath();
		this.ctx.lineTo(this.y_label_offset-2,this.h+1);
		this.ctx.stroke();
	}
	// define the colorbar ONCE!!!
	A =       (options&&options.min)?options.min:Math.min.apply(Math, vals[0]);
	B =       (options&&options.max)?options.max:Math.max.apply(Math, vals[0]);
	levels =  (options&&options.levels)?options.levels:50;
	cmap =    (options&&options.cmap)?options.cmap:'jet';
	cbr = new colorbar(B,A,levels,cmap);// define a colorbar
	height = (this.h/vals[0].length); // left over from the looping... I hope
	curr_x = this.y_label_offset;
	// and.. create the rectangles
	for (ob_key in vals)
	{
		val = vals[ob_key];
		// reset the y placeholder
		curr_y = this.h;
		
		for (ht_key in val)
		{
			v = val[ht_key];
			color = cbr.pick_color(v);
			this.ctx.fillStyle=color; 
			//ctx.fillRect(ob_key*width+y_label_offset,(h - ht_key*height),width,height); //OLD VERSION
			this.ctx.fillRect(curr_x,curr_y - y_size[ht_key],x_size[ob_key],y_size[ht_key]);
			this.ctx.strokeStyle=color; 
			this.ctx.strokeRect(curr_x,curr_y - y_size[ht_key],x_size[ob_key],y_size[ht_key]);
			//ctx.strokeRect(ob_key*width+y_label_offset,(h - ht_key*height),width,height);
			// now update curr vals and whatnot
			curr_y = curr_y - y_size[ht_key];
			
		}
		curr_x = curr_x + x_size[ob_key];	
	}

}
// a little tagalong function to make timestamps prettier
function digit(v) { 
	// make sure numbers are 2 digit
	if (v < 10) return "0"+v; 
	else return v;  
} 
