Fig.prototype.radar = function(az,r,vals,options)
{
	/*
		A method to create an HTML5 canvas radial plot
		// assumes time on the x axis
        Inputs:
		az    = the azimuth direction in radians ( 0 is the top)
		r     = range keys - how far out to go.
		vals = a 2 dimensional array corresponding to the values to be plotted
 		options = a standard object with specifications to be listed later.
	*/

	// now, clear the entire plot, for simplicity
	this.clearPlot();
	this.plottype='radar';
	this.data = {};
	this.data.r = r;
	this.data.az = az; // save for labeling and whatnot
	w = this.w;
	h = this.h; // make it easier to compress

	// determine the width of each range gate by knowing that 2*range.length = smaller of the two dimensions
	smallest_dimension = (w > h)?h:w; // smallest dimension
	gate_width = smallest_dimension/(2*r.length);
	// azimuth does not really need checking... cant do too much.
	
	// there is no time component here, so it is not variable. We can quickly mathematically define the plotting
	
	/*
	LABELS WILL HAVE TO WORK DIFFERENTLY... I DO NOT KNOW YET
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

	//height = (this.h/vals[0].length);
	//curr_x = this.y_label_offset;
	// NOW THE COLORBAR IS NOT DYNAMIC - IT WILL BE DETERMINED ONLY ONCE!
	A =       (options&&options.min)?options.min:Math.min.apply(Math, vals[0]);
	B =       (options&&options.max)?options.max:Math.max.apply(Math, vals[0]);
	levels =  (options&&options.levels)?options.levels:50;
	cmap =    (options&&options.cmap)?options.cmap:'jet';
	cbr = new colorbar(B,A,levels,cmap);// define a colorbar

	// and.. create the shapes
	x0 = this.y_label_offset;
	y0 = this.x_label_offset; //simpler variable names
	ctx = this.ctx; // again, simpler reference.
	az_max = az.length - 1;
	for (az_key in vals)
	{
		val = vals[az_key];
		// determine the bordering azimuth angles.
		if (az_max == 0)
		{
			// well, they made that simpler... starting at 0
			az1 = az_key*az;
			az2 = az1 + az;
			// FIXME - doesn't work right now 
		}
		else
		{
			az_key = az_key*1; // make sure this is an integer
			// safest to break into unit circle components...
			// too lazy - seeking simpler method.
			// component 1 (lower azimuth) median between 
			az_low = (az_key==0)?az[az_max]:az[az_key -1];
			// now check this, if it is larger than az, then we cross the middle
			az_n = (az_low > az[az_key])? az[az_key] + 2*Math.PI:az[az_key]; 
			// now average them, and if the ave is > 2PI, then subtract 2PI
			az1 = (az_low+az_n) / 2;
			az1 -= (az1 > 2*Math.PI)? 2*Math.PI:0; // the correction
			
			// now for the high azimuth			
			az_high = (az_key==az_max)?az[0]:az[az_key + 1];
			// now check this, if it is smller than az, then we cross the middle
			az_high += (az_high < az[az_key])? 2*Math.PI:0; 
				az_n = az[az_key];
			// now average them, and if the ave is > 2PI, then subtract 2PI
			az2 = (az_high+az_n) / 2;
			az2 -= (az2 > 2*Math.PI)? 2*Math.PI:0; // the correction
		}
		// now move it from the mathematical circle to geophysical
		az1 -= Math.PI/2;
		az2 -= Math.PI/2;
		// plot the range gates between azimuths az1 to az2
		for (rg_key in val)
		{
			v = val[rg_key];
			color = cbr.pick_color(v);
			ctx.fillStyle=color; 
			ctx.strokeStyle = color;
			// define the center of our radar plot!
			cx = (w/2) + x0;
			cy = (h/2); // y0 is factored in at the bottom!
			r1 = rg_key * gate_width;
			r2 = r1 + gate_width;

			// create the shape!
			ctx.beginPath();
			// this works... true/false = anticlockwise!!
			ctx.arc(cx,cy,r2,az2,az1,true);
			ctx.arc(cx,cy,r1,az1,az2,false);
			ctx.closePath();

			ctx.fill();
			ctx.stroke();
			// now update curr vals and whatnot
			
		}
	}

}
// a little tagalong function to make timestamps prettier
function digit(v) { 
	// make sure numbers are 2 digit
	if (v < 10) return "0"+v; 
	else return v;  
} 
