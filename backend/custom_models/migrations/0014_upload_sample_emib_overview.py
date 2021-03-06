# Generated by Django 2.1.7 on 2019-05-30 14:07
# Edited by Michael Cherry

from django.db import migrations


def upload_emib_sample_test_overview(apps, schema_editor):
    # get models
    language = apps.get_model("custom_models", "Language")
    item_type = apps.get_model("custom_models", "ItemType")
    item = apps.get_model("custom_models", "Item")
    item_text = apps.get_model("custom_models", "ItemText")
    test = apps.get_model("custom_models", "Test")

    # get db alias
    db_alias = schema_editor.connection.alias

    # create overview item type
    it_overview = item_type(type_desc="overview")
    it_overview.save()

    # lookup languages; get the emib_sample_test
    l_english = (
        language.objects.using(db_alias)
        .filter(ISO_Code_1="en", ISO_Code_2="en-ca")
        .last()
    )
    l_french = (
        language.objects.using(db_alias)
        .filter(ISO_Code_1="fr", ISO_Code_2="fr-ca")
        .last()
    )
    emib_sample_item = (
        test.objects.using(db_alias).filter(test_name="emibSampleTest").last().item_id
    )

    # create the overview item and associated text items
    i_overview = item(parent_id=emib_sample_item, item_type_id=it_overview, order=0)
    i_overview.save()

    item_text.objects.using(db_alias).bulk_create(
        [
            item_text(
                item_id=i_overview,
                text_detail="""## Overview
The electronic Managerial In-Box (e-MIB) simulates an email in-box containing a series of emails depicting situations typically encountered by managers in the federal public service. You must respond to these emails. The situations presented will provide you with the opportunity to demonstrate the Key Leadership Competencies.

## About the sample test
The sample test has been designed to provide you with the opportunity to familiarize yourself with:
* the components of the test (e.g., instructions, background information, email in-box and notepad); and
* the features of the test interface (e.g., menu bars, buttons, etc.).

The background information includes a description of the organization and your role, as well as information on your employees, colleagues and the management team. The background information and the emails are only examples. They reflect neither the length nor the level of difficulty of the real test. More background information and emails are contained in the real test.""",
                language=l_english,
            ),
            item_text(
                item_id=i_overview,
                text_detail="""## Aperçu 
La Boîte de réception pour la gestion électronique (BRG-e) simule une boîte de réception contenant une série de courriels auxquels vous devrez répondre. Ces courriels décrivent des situations auxquelles les gestionnaires de la fonction publique fédérale doivent habituellement faire face. Ces situations vous donneront l’occasion de démontrer les compétences clés en leadership.

## À propos de l’échantillon de test
Cet échantillon de test a été conçu pour vous donner l’occasion de vous familiariser avec :
* les volets du test (p. ex., instructions, information contextuelle, boîte de réception et bloc-notes);
* les fonctionnalités de l’interface du test (p. ex., barres de menu, boutons, etc.).

L’information contextuelle fournie comprend une description de l’organisation et de votre rôle, ainsi que de l’information sur vos employés, vos collègues et l’équipe de gestion. L’information contextuelle et les courriels fournis sont présentés à titre d’exemples seulement. Ils ne reflètent ni la longueur ni le niveau de difficulté du vrai test. Il y a une plus grande quantité d’information contextuelle et plus de courriels dans le vrai test.""",
                language=l_french,
            ),
        ]
    )


def destroy_emib_sample_test_overview(apps, schema_editor):
    # get models
    language = apps.get_model("custom_models", "Language")
    item_type = apps.get_model("custom_models", "ItemType")
    item = apps.get_model("custom_models", "Item")
    item_text = apps.get_model("custom_models", "ItemText")
    test = apps.get_model("custom_models", "Test")

    # get db alias
    db_alias = schema_editor.connection.alias

    # create overview item type
    it_overview = item_type.objects.using(db_alias).filter(type_desc="overview").last()

    # lookup languages; get the emib_sample_test
    l_english = (
        language.objects.using(db_alias)
        .filter(ISO_Code_1="en", ISO_Code_2="en-ca")
        .last()
    )
    l_french = (
        language.objects.using(db_alias)
        .filter(ISO_Code_1="fr", ISO_Code_2="fr-ca")
        .last()
    )
    emib_sample_item = (
        test.objects.using(db_alias).filter(test_name="emibSampleTest").last().item_id
    )
    # get the overview item type and item within the emib sample
    it_overview = item_type.objects.using(db_alias).filter(type_desc="overview").last()

    i_overview = (
        item.objects.using(db_alias)
        .filter(parent_id=emib_sample_item, item_type_id=it_overview, order=0)
        .last()
    )

    # delete the text for the item
    item_text.objects.using(db_alias).filter(
        item_id=i_overview, language=l_english
    ).delete()
    item_text.objects.using(db_alias).filter(
        item_id=i_overview, language=l_french
    ).delete()

    # delete the item
    i_overview.delete()

    # delete the item_type
    it_overview.delete()


class Migration(migrations.Migration):

    dependencies = [("custom_models", "0013_upload_background_tree_view_info")]

    operations = [
        migrations.RunPython(
            upload_emib_sample_test_overview, destroy_emib_sample_test_overview
        )
    ]
