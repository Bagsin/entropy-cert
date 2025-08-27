# Настройка Supabase для хранения сертификатов

## Шаги настройки:

1. **Создайте проект в Supabase**:
   - Зайдите на https://supabase.com
   - Создайте новый проект
   - Скопируйте Project URL и anon public key

2. **Создайте таблицу certificates**:
   Выполните этот SQL в SQL Editor в Supabase:

```sql
-- Создание таблицы для хранения сертификатов
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    certificate_id TEXT UNIQUE NOT NULL,
    certificate_holder TEXT,
    brand TEXT,
    material TEXT,
    issued_date TIMESTAMPTZ,
    identifier TEXT,
    watermark_text TEXT,
    product_image1 TEXT, -- Base64 encoded image
    product_image2 TEXT, -- Base64 encoded image
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создание индекса для быстрого поиска по certificate_id
CREATE INDEX idx_certificates_certificate_id ON certificates(certificate_id);

-- Включение Row Level Security (RLS)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Политики доступа (разрешаем всем читать и создавать сертификаты)
CREATE POLICY "Enable read access for all users" ON certificates FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON certificates FOR UPDATE USING (true);

-- Триггер для обновления поля updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE
    ON certificates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

3. **Обновите конфигурацию в файлах**:

В файле `form.html` найдите строки:
```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key-here'
};
```

И замените на:
```javascript
const SUPABASE_CONFIG = {
    url: 'https://YOUR_PROJECT_ID.supabase.co',
    anonKey: 'YOUR_ANON_PUBLIC_KEY'
};
```

То же самое сделайте в файле `cert.html`.

4. **Пример конфигурации**:
```javascript
const SUPABASE_CONFIG = {
    url: 'https://abcdefghijklmnop.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // Ваш anon key
};
```

5. **Тестирование**:
   - Создайте сертификат через форму
   - Проверьте, что данные сохранились в Supabase
   - Откройте сертификат по ссылке на другом устройстве
   - Убедитесь, что данные загружаются корректно

## Структура таблицы:

| Поле | Тип | Описание |
|------|-----|----------|
| id | SERIAL | Первичный ключ |
| certificate_id | TEXT | ID сертификата (например, C4B897R) |
| certificate_holder | TEXT | Владелец сертификата |
| brand | TEXT | Бренд товара |
| material | TEXT | Материал |
| issued_date | TIMESTAMPTZ | Дата выдачи |
| identifier | TEXT | Идентификатор |
| watermark_text | TEXT | Текст водяного знака |
| product_image1 | TEXT | Изображение товара 1 (Base64) |
| product_image2 | TEXT | Изображение товара 2 (Base64) |
| created_at | TIMESTAMPTZ | Время создания записи |
| updated_at | TIMESTAMPTZ | Время последнего обновления |

## Преимущества Supabase:

✅ Глобальный доступ к данным  
✅ Быстрая синхронизация  
✅ Автоматическое резервное копирование  
✅ Масштабируемость  
✅ Бесплатный тариф для начала  
✅ Простая настройка  

После настройки система будет работать так:
1. Пользователь создает сертификат → данные сохраняются в Supabase
2. Пользователь делится ссылкой → другой человек видит точно те же данные
3. Работает на всех устройствах и браузерах