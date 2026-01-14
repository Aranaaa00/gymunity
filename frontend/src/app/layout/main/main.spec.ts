import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Main } from './main';
import { RouterOutlet, provideRouter } from '@angular/router';
import { Component } from '@angular/core';

@Component({ standalone: true, template: 'Test' })
class TestComponent {}

describe('Main', () => {
  let component: Main;
  let fixture: ComponentFixture<Main>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Main],
      providers: [
        provideRouter([
          { path: 'test', component: TestComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Main);
    component = fixture.componentInstance;
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia contener router-outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });
});
