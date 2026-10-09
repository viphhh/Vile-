with open("server.ts", "r") as f:
    content = f.read()

categorize_route = """  // API Route: AI Categorization of Hotels
  app.post('/api/ai/categorize', async (req, res) => {
    try {
      const { hotels } = req.body;
      if (!hotels || !Array.isArray(hotels)) {
        return res.status(400).json({ success: false, error: 'يجب توفير قائمة الفنادق' });
      }

      const client = getGeminiClient();
      
      const systemInstruction = `أنت خبير سياحي متخصص في تصنيف الفنادق السعودية.
يجب عليك تحليل بيانات الفنادق المقدمة لك (الاسم، الوصف، الميزات) وتصنيف كل فندق إلى فئة واحدة فقط من الفئات التالية:
- "خيار العائلات" (للفنادق التي توفر غرف واسعة، ألعاب أطفال، وقريبة من معالم الجذب)
- "مثالي للأعمال" (للفنادق التي توفر واي فاي سريع، قاعات اجتماعات، ومواقع مركزية للمال والأعمال)
- "وجهة شهر العسل" (للمنتجعات والفنادق الفاخرة، الإطلالات الساحرة، والخدمات الخاصة)

يجب أن تقوم بإرجاع كائن JSON حصراً، حيث يكون المفتاح هو معرف الفندق (id) والقيمة هي الفئة.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `قم بتصنيف هذه الفنادق: ${JSON.stringify(hotels.map((h: any) => ({id: h.id, name: h.name, desc: h.description, amenities: h.amenities})))}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            additionalProperties: { type: Type.STRING }
          }
        }
      });

      const responseText = response.text || '{}';
      let categorized = {};
      try {
        categorized = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing categorized hotels:', e);
      }

      res.json({ success: true, categories: categorized });
    } catch (error: any) {
      console.error('Gemini Categorize Error:', error);
      res.status(500).json({ success: false, error: 'حدث خطأ أثناء التصنيف.' });
    }
  });

"""

content = content.replace("  // API Route: Free Demo External Hotel Sync", categorize_route + "  // API Route: Free Demo External Hotel Sync")

with open("server.ts", "w") as f:
    f.write(content)
