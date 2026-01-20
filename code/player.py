import pygame
import os

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()

        self.animations = {
            "idle": self.load_frames("sprites/idle"),
            "walk": self.load_frames("sprites/walk")
        }

        #Setting all intial values for character
        self.facing_right = True
        self.state = "idle"
        self.frame_index = 0
        self.animation_speed = 0.15  # lower = slower animation

        #Call to animate the entity
        self.image = self.animations[self.state][0]
        self.rect = self.image.get_rect(topleft=(x, y))

        self.speed = 5
    #Takes self and directory to sprites. returns a list of all sprites for an animation
    def load_frames(self, folder):
        frames = []
        for file in sorted(os.listdir(folder)):
            img = pygame.image.load(os.path.join(folder, file)).convert_alpha()
            frames.append(img)
        return frames

    def update(self, keys):
        moving = False

        if keys[pygame.K_a]:
            self.rect.x -= self.speed
            self.facing_right = False
            moving = True
        if keys[pygame.K_d]:
            self.rect.x += self.speed
            self.facing_right = True
            moving = True
        if keys[pygame.K_w]:
            self.rect.y -= self.speed
            moving = True
        if keys[pygame.K_s]:
            self.rect.y += self.speed
            moving = True

        # Change animation state
        self.state = "walk" if moving else "idle"
        self.animate()

    #Takes object of self, finds and refreshes the image for the sprite
    def animate(self):
        frames = self.animations[self.state]

        self.frame_index += self.animation_speed
        if self.frame_index >= len(frames):
            self.frame_index = 0

        image = frames[int(self.frame_index)]
        # Flips animation if facing left
        if not self.facing_right:
            image = pygame.transform.flip(image, True, False)

        self.image = image
        #Scales the sprite to be bigger
        self.image = pygame.transform.scale(self.image, (64, 64))
