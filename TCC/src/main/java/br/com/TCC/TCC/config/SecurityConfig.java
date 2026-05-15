package br.com.TCC.TCC.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration



public class SecurityConfig extends WebSecurityConfigurerAdapter{

	
	@Bean
	public BCryptPasswordEncoder passWordEncoder() {
		
		return new BCryptPasswordEncoder();
	}
	
	// Configura as regras de segurança para as rotas da aplicação
	@Override
	   protected void configure(HttpSecurity http) throws Exception {
	   // Desabilita CSRF e permite acesso livre às rotas de login e cadastro,
	   //além de liberar todas as outras rotas (ajustar conforme necessário)
	http
	.csrf().disable()// Desabilita a proteção CSRF (Cross-Site Request Forgery)
	.authorizeRequests()// Configura as regras de autorização para as rotas
	.antMatchers("/usuarios/login").permitAll()// Permite acesso à rota de login
	.antMatchers("/usuarios/salvar").permitAll()// Permite acesso à rota de cadastro
	.anyRequest().permitAll()// Permite acesso a todas as outras rotas
	.and()// Desabilita o formulário de login padrão do Spring Security
	.formLogin().disable();// Desabilita o logout padrão do Spring Security
	}
	
	
	
}
