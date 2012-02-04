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
