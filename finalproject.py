from vpython import *


# 創建畫布
scene = canvas(title='3D Basketball Court', width=1200, height=600)
heightadjust = -3

# 生成籃球場地板
court = box(pos=vector(0, heightadjust, 0), size=vector(7.5, 0.1, 7), color=color.white)
center = -court.size.z/2

# 生成籃框和籃球架
backboard = box(pos=vector(0, 3.5+heightadjust, center +1.2), size=vector(1.8, 1.2, 0.1), color=color.white)
hoop = ring(pos=vector(0, 3.05+heightadjust, backboard.pos.z+0.45), axis=vector(0, 0.01, 0), radius = 0.23, thickness=0.03, color=color.red)

# generate the paint area
paint1 = box(pos = vector(4.9/2-0.05, heightadjust,center+5.8/2), size = vector(0.1, 0.1, 5.8), color = color.red, opacity = 1)
paint2 = box(pos = vector(-4.9/2+0.05, heightadjust,center+5.8/2), size = vector(0.1, 0.1, 5.8), color = color.red, opacity = 1)
paint3 = box(pos = vector(0, heightadjust,5.8/2-0.05+center+5.8/2), size = vector(4.9, 0.1, 0.1), color = color.red, opacity = 1)
# paint4 = box(pos = vector(0, heightadjust,-5.8/2+0.05+center+5.8/2), size = vector(4.9, 0.1, 0.1), color = color.red, opacity = 1)


# generate the connecting rod
rod = cylinder(pos=vector(0, 3.05+heightadjust, backboard.pos.z+0.05), axis = vector(0, 0, 0.18), radius = 0.03, color=color.red, opacity =1)
pillar = cylinder(pos=vector(0, heightadjust, backboard.pos.z-0.2), axis = vector(0, 3.3,0), radius = 0.2, color = color.cyan)


# 生成籃球
basketball = sphere(pos=vector(0, 1.9+heightadjust, 2.9-0.12), radius=0.12, color=color.orange, make_trail=True, trail_color=color.white)
basketball.m = 0.62 

# 球的初始速度和加速度s
basketball.velocity = vector(-0.05,10, -3)
g = vector(0, -9.8, 0)

# parameters for the ball
C_d = 0.53
rho = 1.293
S = ((basketball.radius)**2)*pi
k = 0.5*C_d*rho*S

# 更新球的運動
dt = 0.001  # 時間步長
maxheight = 0
while True:
    rate(1000)  # 控制動畫更新速度
    if basketball.velocity.x > 0:
        f_x = -k*(basketball.velocity.x**2)
    else :
        f_x = k*(basketball.velocity.x**2)
        
    if basketball.velocity.y > 0:
        f_y = -k*(basketball.velocity.y**2)
    else :
        f_y = k*(basketball.velocity.y**2)
    
    if basketball.velocity.z > 0:
        f_z = -k*(basketball.velocity.z**2)
    else :
        f_z = k*(basketball.velocity.z**2)
    print(type(f_x))
    ax_f = f_x/basketball.m
    ay_f = f_y/basketball.m
    az_f = f_z/basketball.m
    
    
    if(basketball.pos.y <= hoop.pos.y and mag(basketball.pos - hoop.pos) <= hoop.radius-basketball.radius):
        break
    # else:
    #     if(mag(basketball.pos - hop))
    
    basketball.pos += basketball.velocity * dt
    if(basketball.pos.y > maxheight):
        maxheight = basketball.pos.y
        
    
    basketball.velocity += g * dt
    basketball.velocity.x += ax_f*dt
    basketball.velocity.y += ay_f*dt
    basketball.velocity.z += az_f*dt
    
    # 如果球碰到地板，反彈
    if basketball.pos.y < basketball.radius+heightadjust and basketball.velocity.y < 0:
        basketball.velocity.y *= -1

    
    # if basketball.pos.z >= backboard.pos.z:
    #     basketball.velocity.z == 0
    
    # if the ball is near the courtside, stop
    if basketball.pos.x > 3.75:
        break
    elif basketball.pos.x < -3.75:
        break
    elif basketball.pos.z > 3.5:
        break
    elif basketball.pos.z < -3.5+basketball.radius:
        break
    
    
    if (basketball.pos.z <= backboard.pos.z+0.05+basketball.radius+0.05) and (basketball.pos.y <= backboard.pos.y+backboard.size.y/2) and (basketball.pos.y >= backboard.pos.y-backboard.size.y/2) and basketball.velocity.z < 0:
        basketball.velocity.z *= -1 
    
print(maxheight)
    
    
    
   