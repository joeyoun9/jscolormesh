function colorbar_bw(levels)
{
	var mx = 255;
	var mn = 0;
	var span = Math.round((mx-mn)/levels); // color change per level
	var r= [];
	var g= [];
	var b=[];
	for (i=0;i<levels;i=i+1)
	{
		r.push(mn+span*i);
		g.push(mn+span*i);
		b.push(mn+span*i);
	}
	return [r,g,b];
}
