function run()
{
	// create a dataset, and plot it!

	fig = new Fig('plot');

	vals = [];
	x = [];
	for(i = 0;i<800;i=i+1)
	{
		x.push(i*5);
		y = [];
		holder = []; // holds the current 'column'
		for (j=0;j<400;j=j+1)
		{
			y.push(j);
			holder.push(Math.sin(j*2*Math.PI/400)*Math.cos(i*2*Math.PI/800));
		}
		vals.push(holder);
	}
	fig.gridmesh(x,y,vals,{max:1.1,min:-1.1});
}
