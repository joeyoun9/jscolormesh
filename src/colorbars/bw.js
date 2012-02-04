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
