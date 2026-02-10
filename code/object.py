import pygame

class Interactables(pygame.sprite.Sprite):
    def __init__(self, x, y, image_path):
        super().__init__()

        self.image = pygame.image.load(image_path).convert_alpha()
        self.image = pygame.transform.scale(self.image, (64, 64))
        self.rect = self.image.get_rect(topleft=(x, y))

    def interact(self, player):
        pass  # This can be changed in child classes

class Chest(Interactables):
    def __init__(self, x, y, dialogue):
        super().__init__(x, y, "sprites/chest_closed.png")
        self.opened = False
        self.dialogue = dialogue

        #Prep for sprite swap
        self.opened_image = pygame.image.load("sprites/chest_open.png").convert_alpha()
        self.opened_image = pygame.transform.scale(self.opened_image, (64, 64))

    def interact(self, player, dialogue_box):
        if not self.opened:
            dialogue_box.start(self.dialogue)
            self.image = self.opened_image #Sprite swap
            self.opened = True