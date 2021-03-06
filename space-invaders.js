
/*
	@m = reference to std Math
	@k = pressed keys
	@p = normalized player position
	@z = players scale
	@b = bullets array
	@n = enemies array
	@c = ctx of main canvas
	@c2 = ctx of background canvas
	@H = window height
	@W = window width
	@s = enemies speed and direction (right/left)
	@f = 'fillRect' shortcut
	@q = 'forEach' shortcut
	@e = used by cc fn as temp storage
	@x = temp storage
	@y = temp storage
	@$ = document
	@o = frame counter
	@l = 
	@L = 'length' reference
	@t = 
	@a = splice flag

	@v = 

	@i = temp iterator
	@j = temp iterator

	@r = 
	@u = update function
*/

// push shortcut?

// projectile velocity relative to HEIGHT

// player input easing?

W = innerWidth	
H = innerHeight

$ = document
C = 'children'
G = 'getContext'

c  = $.body[C][1][G]('2d')
c2 = $.body[C][0][G]('2d')

// width/height not working from css? TODO fix... later
$.body[C][1].width = W
$.body[C][1].height = H
$.body[C][0].width = W
$.body[C][0].height = H

p = .5
z = .05

m = Math

t = .01

k = {}
a = 0
s = .002

S='splice'

f = 'fillRect'
q = 'forEach'
L = 'length'

o = 0

// game start/restart
function R () {
	n = []
	b = []
	// start invaders and draw inital blocks
	// 5 rows // 3 columns
	c2.globalCompositeOperation='source-over'
	for(i=5;i--;)for(j=3;j--;)n.push({x: i*.1+.1*j, y: j*.1}),c2[f](W/5*i+W*.05, .8*H, W/8, 50)
	c2.globalCompositeOperation='destination-out'
}

R()

// key events
onkeydown=onkeyup=function(e){k[e.keyCode]=e.type!='keyup'}

// update loop
;(function u(){
	o++

	c.clearRect(0,0,W,H)

	// player movement with edge handling
	//if(k[65]|k[68]) p = m.min(m.max(p+= k[65] ? -t : t, 0), 1-z)

	// player movement without edge handling
	p+=k[65]?-t:k[68]?+t:0

	// player shoots
	if(k[32] && o%9<1)b.push({x:p, y:1, v:-t})

	// invaders shoot
	ff = n[~~(m.random()*n[L])]
	if(o%9<1&&n[L]>0) b.push({x:ff.x, y:ff.y , v:t})

	// draw bullets and deal with collision
	// itterating in reverse because we need to remove bullets...
	i=b[L];while(i--){
		l=b[i]

		// player coll
		//if(l.y>.95 && l.v>0 && p-l.x<z/2 && p-l.x>-z/2) R()

		// -5+half-of-player on x to set pivot to middle
		x= W*l.x-5 + H*z/2
		y= (l.y+=l.v)*H

		// remove bullets that go out of bounds...
		if(l.y>1|l.y<-.2) a=1

		// bitmap coll
		if(c2.getImageData(x, y, 1, 1).data[3]>0){
			c2.beginPath()
			c2.arc(x,y,20,0,7)
			c2.fill()
			a=1
		}

		// box collision
		n[q](function(e, i){
			if(!(l.x+z<e.x|l.y+z<e.y|l.y>e.y+z|l.x>e.x+z))if(l.v<0) n[S](i,1),a=1
		})

		// remove or draw?
		a?(b[S](i,1),a=0):c[f](x, y, 10, 30)
	}

	// draw enemies
	n[q](function(e){
		if(e.y>.9) R()
		if(e.x>.98|e.x<0)s=e.x<0?m.abs(s):-m.abs(s),n[q](function(e){e.y+=.1})

		// speed up last enemy
		if(n[L]<2)s=s*1.01
		c[f](W*(e.x+=s),H*e.y,H*z,H*z)
	})

	c[f](W*p, H-H*z, H*z, H*z)

	requestAnimationFrame(u)

})()