import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { App } from './app';
import { PortfolioService } from './services/portfolio.service';
import { UserService } from './services/user.service';

const mockUser = { balance: 500_000 };

const mockUserService = {
  user: signal(mockUser),
};

const mockPortfolioService = {
  balance: signal(500_000),
  subscribedFundIds: signal(new Set<number>()),
  subscribedCount: signal(0),
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: mockUserService },
        { provide: PortfolioService, useValue: mockPortfolioService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the navbar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
  });
});
