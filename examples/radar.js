function run()
{
	// create a dataset, and plot it!
	size = 360;
	vals = [];
	az = [];
	for(i = 0;i<size;i=i+1)
	{
		az.push(i*2*Math.PI/size); // azimuth (radians)
		r = []; // range
		holder = []; // holds the current 'column'
		for (j=0;j<size/5;j=j+1)
		{
			i = i*1;
			j = j*1;
			r.push(j);
			holder.push(Math.sin(j*10*Math.PI/size)*Math.cos(i*2*Math.PI/size));
		}
		vals.push(holder);
	}
	//NOTE IT IS GENERALLY ADVISED TO SPECIFY MIN AND MAX SCALES!!!
	// plot this data in a radar plot


	fig = new Fig('plot');
	fig.radar(az,r,vals,{levels:100,cmap:'jet'});

	// then use the second plot and give a simple gridmesh of the same data
	fig = new Fig('plot2');
	fig.gridmesh(az,r,vals,{levels:100,cmap:'jet'});

}
