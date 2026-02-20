/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - unique identifier for each submission
      - `name` (text, not null) - sender's name
      - `email` (text, not null) - sender's email
      - `phone` (text) - sender's phone number (optional)
      - `message` (text, not null) - the message content
      - `created_at` (timestamptz) - when the submission was created

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anonymous users to insert submissions (public contact form)
    - Add policy for authenticated users to read all submissions (admin access)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
