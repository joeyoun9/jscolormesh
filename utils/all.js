function colorbar_bw(levels)
{
	mx = 255;
	mn = 0;
	span = Math.round((mx-mn)/levels); // color change per level
	r=g=b=[];
	for (i=0;i<levels;i=i+1)
	{
		r.push(mn+span*i);
		g.push(mn+span*i);
		b.push(mn+span*i);
	}
	return [r,g,b];
}
function colorbar(max,min,levels,cmap)
{
	// this is a constructor for a new colorbar 
	// assigning RGB values to ranges for certain colorbars
	// which is passed to assign_color
	// just define value gates!
	this.cvalues = [];
	// exend the spans by 5% on each side!
	range = (max-min)*.05;
	max = max + range;
	min = min + range;
	spans = (max-min)/levels; 
	// cvalues is determined automatically, independent of colors
	for (i=min;i<=max;i=i+spans)
	{
		this.cvalues.push(i);
	} 
	switch (cmap)
	{
		case "grey":
			rgb = colorbar_grey(levels);
		break;
                case "bw":
			rgb = colorbar_bw(levels);
                break;
		case "jet":
			rgb = colorbar_jet(levels); // use the defined function from the *to be included* colorbar packages		
		break;
	}
	// and now we return the object, with the keys
	this.r = rgb[0];
	this.g = rgb[1];
	this.b = rgb[2];

	this.pick_color = function(v)
	{
		// a method to return a color for a value for this defined colorbar
		// cbar is a simple list, so go through the values to the point where you need to be
		lst = this.r.length - 1;
		var rs=gs=bs=0;
		if (v === undefined) {rs=gs=bs=255; } // white for nan/undefined
		else if (v <= this.cvalues[0]) {rs=gs=bs=0;} 
		else if (v > this.cvalues[lst]) { rs=gs=bs=255;  } //fixme
		else if (v == this.cvalues[lst]) {rs=gs=bs=0;}
		else
		{
			for (i in this.cvalues)
			{
				if (i == 0) { rs=gs=bs=200; continue;} // changing the balance!
				sv = this.cvalues[i-1]; // low 'end'
				hsv = this.cvalues[i]; // high 'end'
				// if the value >= to val and < hval, then yay!
				if (v >= sv && v < hsv) 
				{	rs=this.r[i];
					gs=this.g[i];
					bs=this.b[i];
					break;
				}
			}
		}
		// then print out the determined rgb syntax
		return "rgb("+rs+","+gs+","+bs+")";
	}
}

function colorbar_grey(levels)
{
	mx = 255;
	mn = 70;
	span = Math.round((mx-mn)/levels); // color change per level
	r=g=b=[];
	for (i=0;i<levels;i=i+1)
	{
		r.push(mn+span*i);
		g.push(mn+span*i);
		b.push(mn+span*i);
	}
	return [r,g,b];
}
function colorbar_hsv()
{
	//FIXME - NOT HSV YET
	r=[];
	g=[];
	b=[];
	// broken into fifths - blk to blue
	// blu - cyan=g255,b255
	// transfer 255 blue to 255 red - full green	
	// cyan - yellow=g255, r255
	// yellow - red 
	// red - black
			
	//1 divide both the length and the range by fifths
	seg_length = Math.round(levels/5) - 1; //rounding can introduce small errors... oh well
	cps = Math.round(255/seg_length); //color values per value gate for each span range
	// 2. for each segment define #segs of colors covering the needed span
	// total color span change is 255, so
	r = [];
	g = [];
	b = [];
	// SEGMEMNT 1 - black to blue!
	for (i=0;i<=seg_length;i= i+1)
	{	
		r.push(0);
		g.push(0);
		b.push(i*cps);
	}
	// SEGMENT 2 - blue to cyan
	for (i=0;i<=seg_length;i=i+1)
	{	
		r.push(0);
		g.push(i*cps); // green increases to 255
		b.push(255);
	}
	// SEGMENT 3 - cyan to yellow
	for (i=0;i<=seg_length;i=i+1)
	{	
		r.push(i*cps); // increase red
		g.push(255);
		b.push(255 - i*cps); // decrease blue
	}
	// SEGMENT 4 - yellow to red
	for (i=0;i<=seg_length;i=i+1)
	{	
		r.push(255);
		g.push(255 - i*cps);
		b.push(0);
	}
	// SEGMENT 5 - red to black
	for (i=0;i<=seg_length;i=i+1)
	{	
		r.push(255 - i*cps);
		g.push(0);
		b.push(0);
	}
	return [r,g,b];
}
function colorbar_jet(levels)
{
	// broken into fifths - blk to blue
	// blu - cyan=g255,b255
	// transfer 255 blue to 255 red - full green	
	// cyan - yellow=g255, r255
	// yellow - red 
	// red - black
			
	//1 divide both the length and the range by fifths
	seg_length = Math.round(levels/5) - 1; //rounding can introduce small errors... oh well
	cps = Math.round(255/seg_length); //color values per value gate for each span range
	// 2. for each segment define #segs of colors covering the needed span
	// total color span change is 255, so
	r = [];
	g = [];
	b = [];
	// SEGMEMNT 1 - black to blue!
	for (i=0;i<=seg_length;i= i+1)
	{	
		r.push(0);
		g.push(0);
		b.push(i*cps);
	}
	// SEGMENT 2 - blue to cyan
	for (i=0;i<=seg_length;i=i+1)
	{	
		r.push(0);
		g.push(i*cps); // green increases to 255
		b.push(255);
	}
	// SEGMENT 3 - cyan to yellow
	for (i=0;i<=seg_length;i=i+1)
	{	
		r.push(i*cps); // increase red
		g.push(255);
		b.push(255 - i*cps); // decrease blue
	}
	// SEGMENT 4 - yellow to red
	for (i=0;i<=seg_length;i=i+1)
	{	
		r.push(255);
		g.push(255 - i*cps);
		b.push(0);
	}
	// SEGMENT 5 - red to black
	for (i=0;i<=seg_length;i=i+1)
	{	
		r.push(255 - i*cps);
		g.push(0);
		b.push(0);
	}
	return [r,g,b];
}
function Fig(element_id)
{
	// initialize a figure object!!!
		// uses Jquery!
		// additional methods will be added on later
		// only one possible axis instance - so we do not care

	// now figure out how to plot!
	this.ctx=document.getElementById(element_id).getContext("2d");

	// get container width/height
	this.x_label_offset = 22; // pixels to offset
	this.y_label_offset = 35;

	this.w = $("#"+element_id).width();
	this.h = $("#"+element_id).height();
	
	// determine the size of the box
	this.w = this.w - this.y_label_offset;
	this.h = this.h - this.x_label_offset;

	this.clearPlot = function()
	{
		this.ctx.clearRect(0,0,this.w+this.y_label_offset,this.h+this.x_label_offset);
	}

}

function digit(v) { 
	// make sure numbers are 2 digit
	if (v < 10) return "0"+v; 
	else return v;  
} 
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

	///////////////// X LABELS, a total of 6!
	// labels every width*count/4
	for (i=0;i<=count;i=i+((count-1)/4))
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

	height = (this.h/vals[0].length); // left over from the looping... I hope
	curr_x = this.y_label_offset;
	// and.. create the rectangles
	for (ob_key in vals)
	{
		val = vals[ob_key];
		A =       (options&&options.min)?options.min:Math.min.apply(Math, val);
		B =       (options&&options.max)?options.max:Math.max.apply(Math, val);
		levels =  (options&&options.levels)?options.levels:50;
		cmap =    (options&&options.cmap)?options.cmap:'jet';
		cbr = new colorbar(B,A,levels,cmap);// define a colorbar
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
