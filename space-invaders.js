
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
	@l = 'length' shortcut
	@t = 
	@a = splice flag

	@v = box collision fn

	@i = temp iterator
	@j = temp iterator

	@r = 
	@u = update function
*/

// push shortcut?

// projectile velocity relative to HEIGHT

// player input easing?

$ = document

W = innerWidth
H = innerHeight
c = cc()
c2= cc()

p = 0
z = .05
b = []
n = []
m = Math

k = {}

a = 0

s = .001
f = 'fillRect'
q = 'forEach'
l = 'length'

o = 0

// start invaders and draw inital blocks
// 5 rows // 3 columns
for(i=5;i--;)for(j=3;j--;)n.push({x: i*.1+.1*j, y: j*.1}),c2[f](W/5*i+W*.05, .7*H, W/10, 100)

// key events
onkeydown=onkeyup=function(e){k[e.keyCode]=e.type!='keyup'}

// insert canvas to dom - returns 2d context
function cc(){
	e = $.createElement('canvas')
	e.style.position='absolute'
	e.width=W
	e.height=H
	$.body.appendChild(e)
	return e.getContext('2d')
}

// box collision
function v(p1, p2) { return p1.x < p2.x + 10 && p1.x + 10 > p2.x && p1.y < p2.y + 10 && p1.y + 10 > p2.y }

// update loop
(function u(){
	o++

	c.clearRect(0,0,W,H)

	// player moves
	if(k[65]|k[68]) p = m.min(m.max(p+= k[65] ? -.01 : .01, 0), 1-z)
	// player shoots
	if(k[32] && o%5<1)b.push({x:p, y:1, v:-.01})

	// invaders shoot
	ff = n[~~(m.random()*n[l])]
	if(o%20<1&&n[l]>0) b.push({x:ff.x, y:ff.y , v:.01})

	// draw bullets and deal with collision
	b[q](function(l, i){

		// -5+half-of-player on x to set pivot to middle
		x= W*l.x-5 + H*z/2
		y= (l.y+=l.v)*H

		// remove bullets that go out of bounds...
		if(l.y>H|l.y<0) a=1

		if(c2.getImageData(x, y, 1, 1).data[3]>0){
			c2.globalCompositeOperation='destination-out'
			c2.beginPath()
			// using 7 instead of PI*2, works fine
			c2.arc(x,y,20,0,7)
			c2.fill()
			a=1
		}

		// collision
		n[q](function(e){
			//if(v(l,e))console.log('!')			
		})

		c[f](x, y, 10, 40)

		if(a === 1)b.splice(i, 1),a=0
	})

	// draw enemies
	n[q](function(e){
		if(e.x>.97|e.x<0) s*=-1,n[q](function(e){e.y+=.15})
		c[f](W*(e.x+=s),H*e.y,30,30)
	})

	c[f](W*p, H-H*z, H*z, H*z)
	requestAnimationFrame(u)
})()