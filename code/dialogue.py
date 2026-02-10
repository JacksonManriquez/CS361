import pygame

class DialogueBox:
    def __init__(self, width, height):
        self.rect = pygame.Rect(20, height - 200, width - 80, 160)
        self.font = pygame.font.Font(None, 32)

        self.active = False
        self.lines = []
        self.current_line = 0

    def start(self, lines):
        self.lines = lines
        self.current_line = 0
        self.active = True

    def advance(self):
        self.current_line += 1
        if self.current_line >= len(self.lines):
            self.active = False

    def draw(self, screen):
        if not self.active:
            return

        pygame.draw.rect(screen, (20, 20, 20), self.rect)
        pygame.draw.rect(screen, (255, 255, 255), self.rect, 2)

        text = self.font.render(
            self.lines[self.current_line], True, (255, 255, 255)
        )
        screen.blit(text, (self.rect.x, self.rect.y + 20))