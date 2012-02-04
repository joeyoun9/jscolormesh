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

