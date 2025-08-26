from datetime import datetime
today_date = datetime.now().strftime("%A, %B %d, %Y")

def write_email(sender, receiver, context):
    prompt=f"""
        Write a professional email based on the following context: {context}.
        - Sender: {sender if sender else '[sender]'}
        - Receiver: {receiver if receiver else '[receiver]'}
        - Today is {today_date}. Don't say today and don't say currect date instead of write this {today_date} date.
        - If no date is specified, automatically use the real current date and day in the email.
        - Include a sensible reason if none is provided.
        - Email must be ready to send with proper greeting, body, and closing.
        - Do not include instructions, placeholders, or explanations—output only the email content.
        """
    return prompt

def write_search_chat_response(previous_context, latest_message):
    prompt = f"""
        You are a helpful assistant. Here are the previous 5 messages of the conversation to provide context:{previous_context}
        Focus on answering the latest user message: User: {latest_message}, Provide a clear and relevant response based on this context Just 
        for your context today is {today_date}.
        """
    return prompt

def format_email_for_user(raw_email: str) -> str:
    """
    Converts plain text email with \n into structured HTML for display/copy.
    """
    lines = raw_email.split("\n")
    formatted_lines = []

    for line in lines:
        line = line.strip()
        if not line:
            # Add paragraph break
            formatted_lines.append("<br>")
        elif line.lower().startswith("subject:"):
            # Highlight subject
            formatted_lines.append(f"<strong>{line}</strong><br>")
        elif line.lower().startswith("dear "):
            # Greeting
            formatted_lines.append(f"{line}<br><br>")
        elif line.lower().startswith("sincerely") or line.lower().startswith("best regards") or line.lower().startswith("thanks"):
            # Closing
            formatted_lines.append(f"<br>{line}<br>")
        else:
            formatted_lines.append(f"{line}<br>")

    return "".join(formatted_lines)
