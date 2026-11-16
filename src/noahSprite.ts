export const noahSprite={url:`${import.meta.env.BASE_URL}sprites/noah.svg`,width:32,height:48,frames:{idle:0,walkLeft:1,walkRight:2,work:3}} as const;
export type NoahFrame=keyof typeof noahSprite.frames;
export function drawNoah(c:CanvasRenderingContext2D,image:HTMLImageElement,frame:NoahFrame,x:number,y:number,scale=1){const w=noahSprite.width,h=noahSprite.height;c.drawImage(image,noahSprite.frames[frame]*w,0,w,h,x,y,w*scale,h*scale)}
