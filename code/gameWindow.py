import pygame
import sys
from player import Player


pygame.init()

screen_width = 800
screen_height = 800

screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Simple RPG")

clock = pygame.time.Clock()


player_ent = Player(100, 100)

all_sprites = pygame.sprite.Group()
all_sprites.add(player_ent)

# Main game loop
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # Handle player movement
    keys = pygame.key.get_pressed()
    all_sprites.update(keys)
    # Draws the screen
    screen.fill((0, 0, 0))
    all_sprites.draw(screen)

    # Update the display
    pygame.display.flip()
    

    # Cap the frame rate at 60 FPS
    clock.tick(60)