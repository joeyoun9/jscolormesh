function run()
{
	// create a dataset, and plot it!

	size = 300;
	vals = [];
	az = [];
	for(i = 0;i<size;i=i+1)
	{
		az.push(i*2*Math.PI/size); // azimuth (radians)
		r = []; // range
		holder = []; // holds the current 'column'
		for (j=0;j<size;j=j+1)
		{
			r.pushtan;
			holder.push(Math.cos(j*2*Math.PI/size)*Math.cos(i*2*Math.PI/size));
		}
		vals.push(holder);
	}
	alert(vals[0]);
	// plot this data in a radar plot
	fig = new Fig('plot');
	fig.radar(az,r,vals,{levels:100,cmap:'jet',max:1.1,min:-1.1});

	// then use the second plot and give a simple gridmesh of the same data
	fig = new Fig('plot2');
	fig.gridmesh(az,r,vals,{levels:100,cmap:'jet',max:1.1,min:-1.1});

}
