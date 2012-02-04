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
