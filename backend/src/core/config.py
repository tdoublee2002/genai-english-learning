from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
    
    app_name: str
    env: str
    cors_origins: str
    
    database_url: str
    
    # LLM
    openai_api_key: str
    llm_model: str
    llm_timeout_s: int
    
    
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

settings = Settings()

if __name__ == "__main__":
    print(settings.app_name)