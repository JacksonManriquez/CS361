import pygame
import sys
from player import Player
from object import Chest
from dialogue import DialogueBox

pygame.init()

# ------------------ Screen ------------------
screen_width, screen_height = 768, 768
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Simple RPG")
clock = pygame.time.Clock()

# ------------------ Tile Map ------------------
TILE_SIZE = 64
# 0 = floor, 1 = wall, 2 = chest
tile_map = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,2,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
]

# Load tile images
tile_images = {
    0: pygame.transform.scale(pygame.image.load("sprites/surfaces/floor.png"), (TILE_SIZE, TILE_SIZE)),
    1: pygame.transform.scale(pygame.image.load("sprites/surfaces/wall.png"), (TILE_SIZE, TILE_SIZE)),
    2: pygame.transform.scale(pygame.image.load("sprites/surfaces/floor.png"), (TILE_SIZE, TILE_SIZE)),  # chest sits on floor
}

# Sprite groups
all_sprites = pygame.sprite.Group()
solids = pygame.sprite.Group()
interactables = pygame.sprite.Group()

# ------------------ Create world ------------------
for row_index, row in enumerate(tile_map):
    for col_index, tile_id in enumerate(row):
        x, y = col_index * TILE_SIZE, row_index * TILE_SIZE

        # Create solid wall sprites
        if tile_id == 1:
            wall = pygame.sprite.Sprite()
            wall.image = tile_images[1]
            wall.rect = wall.image.get_rect(topleft=(x, y))
            solids.add(wall)
            all_sprites.add(wall)

        # Create chest interactable
        if tile_id == 2:
            chest = Chest(x, y, ["You opened a chest!"])
            interactables.add(chest)
            all_sprites.add(chest)

# ------------------ Player ------------------
player_ent = Player(100, 100)
all_sprites.add(player_ent)

# ------------------ Dialogue Box ------------------
dialogue_box = DialogueBox(screen_width, screen_height)

interact_icon = pygame.image.load("sprites/interact_icon.png").convert_alpha()
interact_icon = pygame.transform.scale(interact_icon, (32, 32))
# ------------------ Main Loop ------------------
last_interact_time = 0
INTERACT_COOLDOWN = 200  # milliseconds

while True:
    current_time = pygame.time.get_ticks()
    show_icon = None
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        # Handle dialogue advance / toggle
        if event.type == pygame.KEYDOWN and event.key == pygame.K_e:
            if current_time - last_interact_time > INTERACT_COOLDOWN:
                last_interact_time = current_time

                if dialogue_box.active:
                    dialogue_box.active = False
                else:
                    # Check for nearby interactables
                    for item in interactables:
                        if player_ent.get_interaction_rect().colliderect(item.rect):
                            
                            item.interact(player_ent, dialogue_box)

    # ------------------ Player Movement ------------------
    keys = pygame.key.get_pressed()
    player_ent.prev_rect = player_ent.rect.copy()
    player_ent.update(keys)

    # ------------------ Collision with solids ------------------
    if pygame.sprite.spritecollide(player_ent, solids, False):
        player_ent.rect = player_ent.prev_rect

    # ------------------ Draw ------------------
    # Draw tiles first (floor and decorations)
    for row_index, row in enumerate(tile_map):
        for col_index, tile_id in enumerate(row):
            screen.blit(tile_images[tile_id], (col_index * TILE_SIZE, row_index * TILE_SIZE))

    # ----------------- Interact icon ----------

    for item in interactables:
        if player_ent.get_interaction_rect().colliderect(item.rect):
            show_icon = item
            break 

    

    # Draw sprites (player, chest)
    all_sprites.draw(screen)
    if show_icon and not dialogue_box.active:
        icon_x = (player_ent.rect.centerx - interact_icon.get_width() //2) + 15
        icon_y = player_ent.rect.top - interact_icon.get_height() - 5
        screen.blit(interact_icon, (icon_x, icon_y))

    # Draw dialogue box on top
    dialogue_box.draw(screen)

    pygame.display.flip()
    clock.tick(60)
