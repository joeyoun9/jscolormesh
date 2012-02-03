function contour_mesh(element_id,x,y,vals,options)
{
	/*
		A method to create a simple html5 canvas meshed value contour
		// assumes time on the x axis
        Inputs:
            element = the id name of the canvas element
            x = the values keying the horizontal portion of the data
            y = the values keying the vertical portion of the data
            vals = a 2 dimensional array corresponding to the values to be plotted
            options = a standard object with specifications to be listed later.
	*/
	// now figure out how to plot!
	var ctx=document.getElementById(element_id).getContext("2d");
	// get container width/height
	var x_label_offset = 22; // pixels to offset
	var y_label_offset = 35;
	var w = $("#"+element_id).width();
	var h = $("#"+element_id).height();
	// now, clear the entire plot, for simplicity
	ctx.clearRect(0,0,w,h);
	
	// determine the size of the box
	w = w - y_label_offset;
	h = h - x_label_offset;
	// if the number of obs received is > than 800, then we will have to 
	// undersample, otherwise, first we will make them all even
	count = vals.length;
	x_vals = x.length;
	y_vals = y.length; // ASSUMES A PERFECT GRID!!
	// define a list of values, keyed with the range, similar to how the colorbar works
	dy = y[y.length - 1] - y[0];
	y_unitsize = h/dy;
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
	x_unitsize = w/dx;
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
	width = (w/count); // the box width in pixels

	///////////////// X LABELS, a total of 6!
	// labels every width*count/4
	for (i=0;i<=count;i=i+((count-1)/4))
	{
		// at position i*width(x) 10(y) place the value x[i]
		// FIXME - this is assuming that x is time - make label object
		t = new Date(x[Math.round(i)]*1000);
		ts = digit(t.getUTCHours())+":"+digit(t.getUTCMinutes()); // only hh:mm no :ss
		ctx.fillStyle="#000000";
		ctx.fillText(ts,i*width*.97 + y_label_offset - 10,h + 20);
		// and add a tick
		ctx.lineWidth = 2;
		ctx.lineCap = 'butt'; //hehe
		ctx.strokeStyle = "#000000";
		ctx.moveTo(Math.round(i*width)+y_label_offset,h + 12);
		ctx.lineTo(Math.round(i*width)+y_label_offset,h);
		ctx.stroke();
	}
	// Y LABELS either interval or number
	numticks = 5; //fixme - make an option
	dy = (y[y.length - 1]  - y[0])/numticks;
	for (i=0;i<y[y.length -1];i=i+500) // 500 interval
	{
		// so, we are able to assume monotonically increasing values
		// and use the y_unitsize to determine the position
		t = parseInt(i); // define the text
		position = h - i*y_unitsize;
		ctx.strokeStyle = "#000000";
		ctx.fillText(t,3,position);
		
		
	}
	// BORDERS
	if (!options||options.border != 'none')
	{
		// create a border
		ctx.beginPath();
		ctx.moveTo(y_label_offset-1,0);
		ctx.closePath();
		ctx.lineTo(y_label_offset-1,h+2);
		ctx.stroke();
		// bottom border - dangit.
		ctx.beginPath();
		ctx.moveTo(w+y_label_offset ,h+1);
		ctx.closePath();
		ctx.lineTo(y_label_offset-2,h+1);
		ctx.stroke();
	}

	height = (h/vals[0].length); // left over from the looping... I hope
	curr_x = y_label_offset;
	// and.. create the rectangles
	for (ob_key in vals)
	{
		val = vals[ob_key];
		A =       (options&&options.min)?options.min:Math.min.apply(Math, values[ob_key]);
		B =       (options&&options.max)?options.max:Math.max.apply(Math, values[ob_key]);
		levels =  (options&&options.levels)?options.levels:50;
		cbar =    (options&&options.cmap)?options.cmap:'jet';
		cbr = colorbar(B,A,levels,cbar);// define a colorbar
		// reset the y placeholder
		curr_y = h;
		
		for (ht_key in val)
		{
			v = val[ht_key];
			ctx.fillStyle=assign_color(cbr,v); 
			//ctx.fillRect(ob_key*width+y_label_offset,(h - ht_key*height),width,height); //OLD VERSION
			ctx.fillRect(curr_x,curr_y - y_size[ht_key],x_size[ob_key],y_size[ht_key]);
			ctx.strokeStyle=assign_color(cbr,v); 
			ctx.strokeRect(curr_x,curr_y - y_size[ht_key],x_size[ob_key],y_size[ht_key]);
			//ctx.strokeRect(ob_key*width+y_label_offset,(h - ht_key*height),width,height);
			// now update curr vals and whatnot
			curr_y = curr_y - y_size[ht_key];
			
		}
		curr_x = curr_x + x_size[ob_key];	
	}

}

function normalize(v,A,B,C,D)
{
	// normalize the value V on a scale of
	// [A..B] -> [C..D]
	
	return ((D-C)/(B-A))*v + (C*B - A*D)/(B-A);
}

function colorbar(max,min,levels,type)
{
	// this will create a colorbar 'object' 
	// assigning RGB values to ranges for certain colorbars
	// which is passed to assign_color
	// just define value gates!
	cvalues = []
	// exend the spans by 5% on each side!
	range = (max-min)*.05;
	max = max + range;
	min = min + range;
	spans = (max-min)/levels; 
	for (i=min;i<=max;i=i+spans)
	{
		cvalues.push(i);
	} 
	switch (type)
	{
		case "grey":
			mx = 250;
			mn = 70;
			span = Math.round((mx-mn)/levels); // color change per level
			r=g=b=[];
			for (i=0;i<levels;i=i+1)
			{
				r.push(mn+span*i);
				g.push(mn+span*i);
				b.push(mn+span*i);
			}
		break;
                case "b/w":
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
                break;
		case "jet":
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
			
		break;
	}
	// and now we return the object, with the keys
	return [r,g,b,cvalues];
}

function assign_color(cbar,v)
{
	// cbar is a simple list, so go through the values to the point where you need to be
	r = cbar[0];
	g = cbar[1];
	b = cbar[2];
	lst = r.length - 1;
	if (v === undefined) {rs=gs=bs=255; } // white for nan/undefined
	else if (v <= cbar[3][0]) {rs=gs=bs=0;} 
	else if (v > cbar[3][lst]) { rs=gs=bs=255;  } //fixme
	else if (v == cbar[3][lst]) {rs=gs=bs=0;}
	else
	{
		for (i in cbar[3])
		{
			if (i == 0) { rs=gs=bs=200; continue;} // changing the balance!
			sv = cbar[3][i-1]; // low 'end'
			hsv = cbar[3][i]; // high 'end'
			// if the value >= to val and < hval, then yay!
			if (v >= sv && v < hsv) 
			{	rs=r[i];
				gs=g[i];
				bs=b[i];
				break;
			}
	}}
	
	return "rgb("+rs+","+gs+","+bs+")";
}

function digit(v) { 
	// make sure numbers are 2 digit
	if (v < 10) return "0"+v; 
	else return v;  
} 
